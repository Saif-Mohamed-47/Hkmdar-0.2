import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * DELETE /api/documents/[id]
 * Retrieve document metadata, delete storage object from 'case-documents' bucket,
 * and delete record from 'documents' table.
 */
export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'معرف المستند مطلوب' }, { status: 400 });
    }

    const supabase = createServerClient(req);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً (Unauthorized)' },
        { status: 401 }
      );
    }

    // Retrieve document metadata to get file_path
    const { data: docRecord, error: fetchError } = await supabase
      .from('documents')
      .select('id, file_path, lawyer_id')
      .eq('id', id)
      .eq('lawyer_id', user.id)
      .single();

    if (fetchError || !docRecord) {
      return NextResponse.json(
        { error: 'المستند غير موجود أو غير مصرح بالوصول إليه' },
        { status: 404 }
      );
    }

    // Delete file from Supabase Storage bucket 'case-documents'
    if (docRecord.file_path) {
      const { error: storageError } = await supabase
        .storage
        .from('case-documents')
        .remove([docRecord.file_path]);

      if (storageError) {
        console.error('Failed to remove file from storage:', storageError.message);
      }
    }

    // Delete metadata row from 'documents' table
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
      .eq('lawyer_id', user.id);

    if (dbError) {
      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * POST /api/documents/upload
 * Upload a document (PDF or DOCX, max 10MB) to Supabase Storage bucket 'case-documents'
 * and insert metadata row in 'documents' table.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient(req);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً (Unauthorized)' },
        { status: 401 }
      );
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json(
        { error: 'بيانات نموذج غير صالحة (Invalid FormData)' },
        { status: 400 }
      );
    }

    const caseId = formData.get('case_id') as string;
    const file = formData.get('file') as File | null;

    if (!caseId || typeof caseId !== 'string' || !caseId.trim()) {
      return NextResponse.json({ error: 'معرف القضية مطلوب' }, { status: 400 });
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'ملف المستند مطلوب' }, { status: 400 });
    }

    // Validate File Size (Max 10MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'حجم الملف يتجاوز الحد الأقصى المسموح به (10MB)' },
        { status: 400 }
      );
    }

    // Validate File Type (PDF, Word DOC/DOCX, Excel XLS/XLSX/CSV)
    const fileNameLower = file.name.toLowerCase();
    const isPdf = file.type === 'application/pdf' || fileNameLower.endsWith('.pdf');
    const isDocx = 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword' ||
      fileNameLower.endsWith('.docx') ||
      fileNameLower.endsWith('.doc');
    const isExcel =
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'text/csv' ||
      fileNameLower.endsWith('.xlsx') ||
      fileNameLower.endsWith('.xls') ||
      fileNameLower.endsWith('.csv');

    if (!isPdf && !isDocx && !isExcel) {
      return NextResponse.json(
        { error: 'نوع الملف غير مدعوم. يسمح بملفات PDF و Word (DOC/DOCX) و Excel (XLS/XLSX/CSV)' },
        { status: 400 }
      );
    }

    // Verify case ownership for authenticated lawyer
    const { data: caseRecord, error: caseError } = await supabase
      .from('cases')
      .select('id')
      .eq('id', caseId)
      .eq('lawyer_id', user.id)
      .single();

    if (caseError || !caseRecord) {
      return NextResponse.json(
        { error: 'القضية غير موجودة أو غير مصرح بالوصول إليها' },
        { status: 404 }
      );
    }

    // Format Storage Path: <lawyer_id>/<uuid>_<original-file-name>
    const safeFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const uniqueStoragePath = `${user.id}/${crypto.randomUUID()}_${safeFileName}`;

    const fileBuffer = await file.arrayBuffer();

    // Upload to Supabase Storage bucket 'case-documents'
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('case-documents')
      .upload(uniqueStoragePath, fileBuffer, {
        contentType: file.type || (isPdf ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
        upsert: false,
      });

    if (uploadError || !uploadData) {
      return NextResponse.json(
        { error: uploadError?.message || 'حدث خطأ أثناء رفع الملف إلى التخزين' },
        { status: 500 }
      );
    }

    const filePath = uploadData.path || uniqueStoragePath;

    // Insert database record in 'documents' table
    const { data: docRecord, error: dbError } = await supabase
      .from('documents')
      .insert({
        case_id: caseId,
        lawyer_id: user.id,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
      })
      .select()
      .single();

    // Rollback/Clean up storage file if database insert fails
    if (dbError || !docRecord) {
      await supabase.storage.from('case-documents').remove([filePath]);
      return NextResponse.json(
        { error: dbError?.message || 'حدث خطأ أثناء تسجيل المستند في قاعدة البيانات' },
        { status: 500 }
      );
    }

    return NextResponse.json(docRecord, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

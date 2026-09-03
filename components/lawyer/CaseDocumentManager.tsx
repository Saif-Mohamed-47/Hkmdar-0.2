'use client';

import React, { useState, useRef } from 'react';
import { 
  FileUp, 
  FileText, 
  FileSpreadsheet, 
  Trash2, 
  Download, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  File,
  Eye
} from 'lucide-react';
import { CaseDocument } from '@/lib/types';
import { useApp } from '@/lib/context/AppContext';

interface CaseDocumentManagerProps {
  caseId: string;
  initialDocuments?: CaseDocument[];
  onDocumentAdded?: (doc: CaseDocument) => void;
}

export default function CaseDocumentManager({
  caseId,
  initialDocuments = [],
  onDocumentAdded,
}: CaseDocumentManagerProps) {
  const { addToast } = useApp();
  const [documents, setDocuments] = useState<CaseDocument[]>(initialDocuments);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (fileName: string): 'pdf' | 'word' | 'excel' | 'image' | 'other' => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'word';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'excel';
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return 'image';
    return 'other';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'word':
        return <FileText className="w-5 h-5 text-blue-500 shrink-0" />;
      case 'excel':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-500 shrink-0" />;
      default:
        return <File className="w-5 h-5 text-[var(--accent-gold)] shrink-0" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'word':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'excel':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv'];
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

    if (!allowedExtensions.includes(fileExt)) {
      addToast({
        type: 'error',
        title: 'صيغة غير مدعومة',
        message: 'يرجى رفع ملفات PDF أو Word (DOC/DOCX) أو Excel (XLS/XLSX/CSV) فقط.',
      });
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      addToast({
        type: 'error',
        title: 'الملف كبير جداً',
        message: 'الحد الأقصى لحجم الملف هو 15 ميجابايت.',
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileType = getFileType(file.name);
      
      // Create local document object
      const newDoc: CaseDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        caseId,
        fileName: file.name,
        fileSize: file.size,
        fileType,
        uploadedAt: new Date().toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        uploadedBy: 'المحامي المسند إليه',
        fileUrl: URL.createObjectURL(file),
      };

      setDocuments((prev) => [newDoc, ...prev]);
      if (onDocumentAdded) onDocumentAdded(newDoc);

      addToast({
        type: 'success',
        title: 'تم رفع المستند بنجاح',
        message: `تم إدراج ملف "${file.name}" ضمن حافظة مستندات القضية.`,
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'خطأ في الرفع',
        message: err.message || 'تعذر رفع الملف، يرجى المحاولة لاحقاً.',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteDocument = (docId: string, docName: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    addToast({
      type: 'info',
      title: 'تم حذف المستند',
      message: `تم إزالة "${docName}" من ملف القضية.`,
    });
  };

  return (
    <div className="p-6 rounded-3xl legal-card space-y-5 shadow-lg">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/30 flex items-center justify-center">
            <FileUp className="w-4 h-4 text-[var(--accent-gold)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              حافظة المستندات والمرفقات القضائية (PDF / Word / Excel)
            </h3>
            <p className="text-[11px] text-[var(--text-secondary)]">
              رفع وتوثيق عرائض الدعاوى، الإنذارات الرسمية، كشوف الحسابات، وصحف الطعن
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl btn-legal-gold text-xs font-bold cursor-pointer disabled:opacity-50 shrink-0 shadow-sm"
        >
          {isUploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <FileUp className="w-3.5 h-3.5" />
          )}
          <span>رفع مستند جديد</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFileUpload(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-[var(--accent-gold)] bg-[var(--bg-surface-hover)]'
            : 'border-[var(--border-subtle)] bg-[var(--bg-input)] hover:border-[var(--accent-gold)]/50'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center shadow-inner">
            <FileUp className="w-5 h-5 text-[var(--accent-gold)]" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-[var(--text-primary)]">
              اضغط لرفع ملف أو اسحبه وأفلته هنا
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">
              يدعم ملفات <strong>PDF</strong>، مستندات Word (<strong>DOC / DOCX</strong>)، وشيتات Excel (<strong>XLSX / XLS / CSV</strong>) حتى 15 ميجابايت
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-semibold px-1">
          <span>المستندات المرفقة ({documents.length})</span>
          <span>الحجم والتاريخ</span>
        </div>

        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/40 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 shadow-sm">
                    {getFileIcon(doc.fileType)}
                  </div>
                  <div className="truncate space-y-0.5">
                    <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                      {doc.fileName}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                      <span className={`px-1.5 py-0.2 rounded border text-[9px] uppercase font-bold ${getBadgeColor(doc.fileType)}`}>
                        {doc.fileType}
                      </span>
                      <span>{doc.uploadedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] hidden sm:inline-block">
                    {formatFileSize(doc.fileSize)}
                  </span>
                  
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      download={doc.fileName}
                      className="p-1.5 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/40 transition-colors"
                      title="تحميل الملف"
                    >
                      <Download className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteDocument(doc.id, doc.fileName)}
                    className="p-1.5 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-rose-500/20 text-[var(--text-muted)] hover:text-rose-400 border border-[var(--border-subtle)] hover:border-rose-500/30 transition-colors cursor-pointer"
                    title="حذف المستند"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-center text-xs text-[var(--text-muted)]">
            لا توجد مستندات مرفقة بهذه القضية حتى الآن.
          </div>
        )}
      </div>

    </div>
  );
}

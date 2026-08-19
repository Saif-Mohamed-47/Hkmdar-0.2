'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-lg transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-5 ${
              isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100'
                : isError
                ? 'bg-red-950/90 border-red-500/50 text-red-100'
                : isWarning
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-100'
                : 'bg-slate-900/90 border-blue-500/50 text-blue-100'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <XCircle className="w-5 h-5 text-red-400" />}
              {isWarning && <AlertCircle className="w-5 h-5 text-amber-400" />}
              {isInfo && <Info className="w-5 h-5 text-blue-400" />}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{toast.title}</h4>
              <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

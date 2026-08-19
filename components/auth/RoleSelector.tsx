'use client';

import React from 'react';
import { UserRole } from '@/lib/types';
import { Briefcase, Users, Scale, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
}

export default function RoleSelector({
  selectedRole,
  onChange,
  disabled = false,
}: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-300">
        نوع الحساب:
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Client Role Option */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('client')}
          className={`relative flex items-start gap-3.5 p-3.5 rounded-2xl border text-right transition-all duration-200 cursor-pointer ${selectedRole === 'client'
            ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-emerald-950/20 border-emerald-500/80 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/30'
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850 opacity-70 hover:opacity-100'
            }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${selectedRole === 'client'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-inner'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
          >
            <Users className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1.5 mb-0.5">
              <span
                className={`text-xs font-bold ${selectedRole === 'client' ? 'text-white' : 'text-slate-300'
                  }`}
              >
                عميل / طالب استشارة
              </span>
              {selectedRole === 'client' && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  مُختار
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              استشارات قانونية فورية بالذكاء الاصطناعي وتوكيل محامين
            </p>
          </div>

          <div className="absolute top-2 left-2 text-[14px]">👤</div>
        </button>

        {/* Lawyer Role Option */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('lawyer')}
          className={`relative flex items-start gap-3.5 p-3.5 rounded-2xl border text-right transition-all duration-200 cursor-pointer ${selectedRole === 'lawyer'
            ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-amber-950/20 border-amber-500/80 shadow-lg shadow-amber-950/50 ring-1 ring-amber-500/30'
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850 opacity-70 hover:opacity-100'
            }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${selectedRole === 'lawyer'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-inner'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
          >
            <Briefcase className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1.5 mb-0.5">
              <span
                className={`text-xs font-bold ${selectedRole === 'lawyer' ? 'text-white' : 'text-slate-300'
                  }`}
              >
                محامٍ ممارس / مكتب محاماة
              </span>
              {selectedRole === 'lawyer' && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  مُختار
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              استقبال قضايا مجهزة، صياغة مذكرات، وإدارة الجلسات
            </p>
          </div>

          <div className="absolute top-2 left-2 text-[14px]">👨‍⚖️</div>
        </button>
      </div>
    </div>
  );
}

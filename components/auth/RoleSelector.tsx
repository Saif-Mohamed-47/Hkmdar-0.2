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
      <label className="block text-xs font-bold text-slate-400 tracking-wide">
        نوع الحساب / الدور:
      </label>

      <div className="p-1 rounded-2xl bg-slate-950/60 border border-white/5 flex gap-1.5 shadow-inner">
        {/* Client Tab Option */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('client')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-xs transition-all duration-300 relative overflow-hidden cursor-pointer ${
            selectedRole === 'client'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 text-white shadow-lg shadow-emerald-950/40 border border-emerald-500/20 hover:brightness-105 active:scale-[0.98]'
              : 'text-slate-400 hover:text-white hover:bg-white/5 active:scale-[0.98]'
          }`}
        >
          <span className="text-[14px]">👤</span>
          <span>عميل / طالب استشارة</span>
        </button>

        {/* Lawyer Tab Option */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('lawyer')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-xs transition-all duration-300 relative overflow-hidden cursor-pointer ${
            selectedRole === 'lawyer'
              ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white shadow-lg shadow-amber-950/40 border border-amber-500/20 hover:brightness-105 active:scale-[0.98]'
              : 'text-slate-400 hover:text-white hover:bg-white/5 active:scale-[0.98]'
          }`}
        >
          <span className="text-[14px]">👨‍⚖️</span>
          <span>محامٍ ممارس</span>
        </button>
      </div>
    </div>
  );
}

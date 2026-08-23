'use client';

import React from 'react';
import { UserRole } from '@/lib/types';
import { Users, Scale, Check } from 'lucide-react';

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
      <label className="block text-xs font-semibold text-[var(--text-secondary)] tracking-wide text-right">
        نوع الحساب / صفة المستخدم:
      </label>

      <div className="p-1 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] flex gap-2">
        {/* Client Tab Option */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('client')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
            selectedRole === 'client'
              ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--accent-gold)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
          }`}
        >
          <Users className={`w-4 h-4 ${selectedRole === 'client' ? 'text-[var(--accent-gold)]' : 'text-slate-500'}`} />
          <span>موكل / طالب استشارة</span>
          {selectedRole === 'client' && <Check className="w-3.5 h-3.5 text-[var(--accent-gold)] mr-auto" />}
        </button>

        {/* Lawyer Tab Option */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('lawyer')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
            selectedRole === 'lawyer'
              ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--accent-gold)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
          }`}
        >
          <Scale className={`w-4 h-4 ${selectedRole === 'lawyer' ? 'text-[var(--accent-gold)]' : 'text-slate-500'}`} />
          <span>محامٍ معتمد</span>
          {selectedRole === 'lawyer' && <Check className="w-3.5 h-3.5 text-[var(--accent-gold)] mr-auto" />}
        </button>
      </div>
    </div>
  );
}

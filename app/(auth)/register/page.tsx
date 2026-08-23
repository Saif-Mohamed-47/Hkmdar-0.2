'use client';

import React, { Suspense } from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-center items-center px-4 py-8 relative transition-colors duration-200">
      <Suspense fallback={
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-[var(--accent-gold)] animate-spin" />
        </div>
      }>
        <AuthForm initialMode="register" />
      </Suspense>
    </div>
  );
}

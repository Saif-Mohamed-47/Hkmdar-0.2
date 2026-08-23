'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { useApp } from '@/lib/context/AppContext';
import { Loader2 } from 'lucide-react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, user, addToast } = useApp();
  const router = useRouter();

  useEffect(() => {
    // If the authenticated user is a lawyer, redirect them to lawyer dashboard
    if (user.email && role === 'lawyer') {
      addToast({
        type: 'info',
        title: 'بوابة المحامي',
        message: 'تم توجيهك إلى لوحة تحكم المحامين الخاصة بك.',
      });
      router.replace('/lawyer/dashboard');
    }
  }, [role, user.email, router, addToast]);

  if (user.email && role === 'lawyer') {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[var(--accent-gold)] animate-spin" />
        <p className="text-xs text-[var(--text-secondary)]">جاري إعادة توجيهك إلى بوابة المحامي...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col transition-colors duration-200">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}


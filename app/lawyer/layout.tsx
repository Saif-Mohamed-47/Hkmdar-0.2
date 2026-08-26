'use client';

import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useApp } from '@/lib/context/AppContext';
import { useRouter } from 'next/navigation';

export default function LawyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (role === 'client') {
      router.replace('/client/dashboard');
    }
  }, [role, router]);

  if (role === 'client') {
    return null;
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


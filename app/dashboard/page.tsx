'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { Loader2 } from 'lucide-react';

export default function DashboardRedirectPage() {
  const { role } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (role === 'lawyer') {
      router.replace('/lawyer/dashboard');
    } else {
      router.replace('/client/dashboard');
    }
  }, [role, router]);

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      <p className="text-xs text-slate-400">جاري التوجيه إلى لوحة التحكم المخصصة...</p>
    </div>
  );
}

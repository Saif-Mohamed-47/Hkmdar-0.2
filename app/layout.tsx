import type { Metadata } from 'next';
import { Cairo, Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/context/AppContext';
import ToastContainer from '@/components/ui/ToastContainer';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'حكمدار، المساعد القضائي الذكي',
  description: 'منصة قانونية متكاملة مدعومة بالذكاء الاصطناعي للاستشارات القانونية، البحث في السوابق والتشريعات، ترشيح المحامين، وإدارة ملفات القضايا.',
  keywords: ['حكمدار', 'محاماة', 'استشارات قانونية', 'ذكاء اصطناعي قانوني', 'قانون العمل', 'شيك بدون رصيد', 'محكمة النقض'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body 
        className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white"
        suppressHydrationWarning
      >
        <AppProvider>
          {children}
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}

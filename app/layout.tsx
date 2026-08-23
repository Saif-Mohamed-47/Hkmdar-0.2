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
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'حكمدار | المنظومة الرقمية لإدارة القضايا والاستشارات القانونية',
  description: 'منصة قانونية متكاملة لربط الموكلين بنخبة المحامين المعتمدين، البحث في التشريعات وأحكام محكمة النقض، وإدارة ملفات الدعاوى القضائية بأعلى معايير السرية والاحترافية.',
  keywords: ['حكمدار', 'محاماة', 'استشارات قانونية', 'إدارة القضايا', 'محكمة النقض', 'قانون العمل', 'صياغة المذكرات القضائية', 'محامين معتمدين'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable} h-full dark`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('hakmdar_theme_v1');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.documentElement.setAttribute('data-theme', 'light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body 
        className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col font-sans antialiased transition-colors duration-200 selection:bg-[#c5a059] selection:text-[#060a14]"
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

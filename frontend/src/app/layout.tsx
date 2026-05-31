import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-be-vietnam-pro',
});

export const metadata: Metadata = {
  title: 'Khang Sales Management',
  description: 'Hệ thống hỗ trợ quản lý bán hàng',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body>{children}</body>
    </html>
  );
}
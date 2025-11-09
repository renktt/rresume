import ClientLayout from '@/components/ClientLayout';
import '@/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Renante Marzan | Portfolio & LMS',
  description: 'Professional portfolio, resume, and learning management system with AI-powered digital twin',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

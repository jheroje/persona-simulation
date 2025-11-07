import AvatarMenu from '@/components/AvatarMenu';
import { LoadingProvider } from '@/components/LoadingProvider';
import { ToastProvider } from '@/components/ToastProvider';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Persona Simulation',
  description: 'Chat with various personas in different scenarios',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ToastProvider>
      <LoadingProvider>
        <html lang="en">
          <head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <header className="fixed top-4 right-5 z-50">
              <AvatarMenu />
            </header>
            {children}
          </body>
        </html>
      </LoadingProvider>
    </ToastProvider>
  );
}

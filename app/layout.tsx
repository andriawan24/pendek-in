import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'TrimBento - Link Shortener',
  description: 'Beautiful dark mode link shortener with analytics',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-charcoal min-h-screen">
        <AuthProvider>{children}</AuthProvider>

        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              border: '2px solid #3f3f46',
              color: 'white',
            },
          }}
        />
      </body>
    </html>
  );
}

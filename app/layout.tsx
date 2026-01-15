import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Pendek In - Links That Work As Hard As You Do',
  description:
    'Feature-rich link shortener with real-time analytics, custom QR codes, and a sleek dark dashboard. Designed for developers and creators who want outstanding tools.',
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
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
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

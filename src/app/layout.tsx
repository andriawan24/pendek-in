import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import CustomThemeProvider from '@/components/CustomThemeProvider';
import { AuthProvider } from '@/components/AuthProvider';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import { ToastContainer } from 'react-toastify';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pendek.in - Personal URL Shortener',
  description: 'A simple, personal URL shortener to create short, memorable links',
  keywords: ['url shortener', 'link shortener', 'pendek.in', 'short links'],
  authors: [{ name: 'Pendek.in' }],
  creator: 'Pendek.in',
  publisher: 'Pendek.in',
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
  themeColor: '#8b5a9b',
  viewport: 'width=device-width, initial-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pendek.in',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900`}
      >
        <CustomThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <ToastContainer theme="dark" />
          </AuthProvider>
        </CustomThemeProvider>
      </body>
    </html>
  );
}

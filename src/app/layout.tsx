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

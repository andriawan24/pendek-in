import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Pendek.in',
  description: 'Log in or sign up to Pendek.in - Your personal URL shortener',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import EmailVerificationAlert from '@/components/EmailVerificationAlert';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen transition-colors">
      <Header />
      <EmailVerificationAlert />
      {children}
      <Footer />
    </div>
  );
}

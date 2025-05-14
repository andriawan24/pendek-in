import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen transition-colors">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

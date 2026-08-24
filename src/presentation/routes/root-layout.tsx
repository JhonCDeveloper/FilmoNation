import { Outlet } from 'react-router';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

export function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen min-w-screen bg-surface text-ink">
      <Header />

      <main className="flex-1 w-full px-8 py-6 md:px-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

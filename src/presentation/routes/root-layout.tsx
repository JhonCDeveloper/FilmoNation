import { Outlet } from 'react-router';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

export function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-surface text-ink">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

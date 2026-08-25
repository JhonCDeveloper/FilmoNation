import { Outlet } from 'react-router';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { RouteFocusManager } from '../components/layout/route-focus-manager';

export function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-surface text-ink">
      {/* Gestión de foco y document.title en cada transición */}
      <RouteFocusManager appName="FilmoNation" />

      <Header />

      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

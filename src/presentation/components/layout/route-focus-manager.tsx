/**
 * RouteFocusManager — Gestión de foco y document.title en transiciones de ruta.
 *
 * En cada cambio de ubicación:
 * 1. Actualiza document.title con el nombre de la página.
 * 2. Transfiere el foco al <h1 id="page-title"> con tabindex="-1".
 *    Si no existe, focaliza el <main>.
 *
 * Regla WCAG 2.4.3 (Focus Order) y 2.4.2 (Page Titled).
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router';

interface RouteFocusManagerProps {
  /** Título base de la aplicación, se añade como sufijo: "Inicio | FilmoNation" */
  appName?: string;
}

const PAGE_TITLES: Record<string, string> = {
  '/': 'Inicio',
};

function resolveTitleFromPath(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/movie/')) return 'Detalle de Película';
  if (pathname.startsWith('/trending')) return 'Tendencias';
  if (pathname.startsWith('/passport')) return 'Mi Pasaporte';
  return 'Página';
}

export function RouteFocusManager({ appName = 'FilmoNation' }: RouteFocusManagerProps) {
  const location = useLocation();

  useEffect(() => {
    // 1. Actualizar el título del documento
    const pageTitle = resolveTitleFromPath(location.pathname);
    document.title = `${pageTitle} | ${appName}`;

    // 2. Mover el foco al encabezado principal o al <main>
    //    requestAnimationFrame garantiza que el nuevo árbol del DOM ya se haya pintado.
    const frameId = requestAnimationFrame(() => {
      const heading = document.getElementById('page-heading');
      const main = document.querySelector<HTMLElement>('main');

      const target = heading ?? main;
      if (!target) return;

      // tabindex="-1" permite enfocar elementos no interactivos programáticamente
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus({ preventScroll: false });
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [location.pathname, appName]);

  // Este componente no renderiza nada; solo tiene efectos secundarios
  return null;
}

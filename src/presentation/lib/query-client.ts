import { QueryClient } from '@tanstack/react-query';
import type { HttpError } from '@/infrastructure/http/http-error';

// Configuración global de caducidad y eliminación de caché
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Regla de Negocio: Tratar la caché como una copia que caduca (Stale) a los 5 minutos por defecto
      staleTime: 1000 * 60 * 5, // 5 minutos de tiempo fresco antes de ser considerada "obsoleta"
      gcTime: 1000 * 60 * 30, // 30 minutos inactiva en memoria antes del recolector de basura
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const httpError = error as HttpError;
        if (httpError.type === 'NOT_FOUND' || httpError.type === 'VALIDATION') {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

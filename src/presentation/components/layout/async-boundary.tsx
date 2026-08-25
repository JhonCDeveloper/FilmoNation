import type { ReactNode } from 'react';
import { MovieGridSkeleton } from '../ui/movie-grid-skeleton';
import { StateError } from '../ui/state-error';
import { StateEmpty, type EmptyStateType } from '../ui/state-empty';

export interface AsyncBoundaryProps {
  /** ¿Está en proceso de carga inicial? */
  isLoading: boolean;

  /** ¿Hubo un error en la carga? */
  isError: boolean;

  /** Objeto de error capturado */
  error?: Error | null;

  /** Callback para reintentar la operación en caso de error */
  onRetry?: () => void;

  /** ¿Los datos devueltos están vacíos? (Evaluado por el consumidor) */
  isEmpty?: boolean;

  /** Tipo de estado vacío a mostrar */
  emptyType?: EmptyStateType;

  /** Acción para resolver el estado vacío (ej: limpiar filtros) */
  onEmptyAction?: () => void;

  /** Texto personalizado para la acción de estado vacío */
  emptyActionLabel?: string;

  /** Componente personalizado a mostrar durante la carga */
  loadingFallback?: ReactNode;

  /** Contenido principal a renderizar si no hay error, ni carga, ni estado vacío */
  children: ReactNode;
}

/**
 * Orquestador Declarativo de los Cuatro Estados de UI:
 * 1. Loading (Carga proyectada / Skeletons)
 * 2. Error (Traducción inteligente de fallos)
 * 3. Empty (Resolución de callejones sin salida)
 * 4. Success (Renderizado de children)
 *
 * Este patrón evita los saltos de diseño (CLS) y estandariza
 * la retroalimentación en cualquier flujo de datos asíncrono.
 */
export function AsyncBoundary({
  isLoading,
  isError,
  error = null,
  onRetry,
  isEmpty = false,
  emptyType = 'initial',
  onEmptyAction,
  emptyActionLabel,
  loadingFallback = <MovieGridSkeleton />,
  children,
}: AsyncBoundaryProps) {
  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  if (isError) {
    return <StateError error={error} onRetry={onRetry} />;
  }

  if (isEmpty) {
    return <StateEmpty type={emptyType} onAction={onEmptyAction} actionLabel={emptyActionLabel} />;
  }

  return <>{children}</>;
}

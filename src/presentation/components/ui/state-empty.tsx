import { Link } from 'react-router';
import { FolderOpen, SearchX, Compass } from 'lucide-react';

export type EmptyStateType = 'initial' | 'filtered' | 'passport';

export interface StateEmptyProps {
  type?: EmptyStateType | undefined;
  title?: string | undefined;
  message?: string | undefined;
  onAction?: (() => void) | undefined;
  actionLabel?: string | undefined;
}

const DEFAULT_CONFIGS = {
  initial: {
    icon: <Compass className="w-12 h-12 text-ink-muted/50" />,
    title: 'El archivo está vacío',
    message:
      'Aún no has sellado ninguna película ni guardado visas pendientes. Explora las tendencias para iniciar tu historial.',
    actionLabel: 'Explorar Tendencias',
  },
  filtered: {
    icon: <SearchX className="w-12 h-12 text-ink-muted/50" />,
    title: 'Ningún expediente encontrado',
    message:
      'Tus criterios de búsqueda actuales no coinciden con ningún archivo en nuestra base de datos.',
    actionLabel: 'Limpiar Filtros',
  },
  passport: {
    icon: <FolderOpen className="w-12 h-12 text-ink-muted/50" />,
    title: 'Pasaporte en Blanco',
    message: 'Aún no hay registros en esta sección de tu pasaporte.',
    actionLabel: 'Volver al Inicio',
  },
};

export function StateEmpty({
  type = 'initial',
  title,
  message,
  onAction,
  actionLabel,
}: StateEmptyProps) {
  const config = DEFAULT_CONFIGS[type];

  const displayTitle = title ?? config.title;
  const displayMessage = message ?? config.message;
  const displayActionLabel = actionLabel ?? config.actionLabel;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in duration-500">
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-surface-raised mb-6 border border-line border-dashed">
        {config.icon}
      </div>

      <h3 className="font-display font-semibold text-2xl text-ink mb-3">{displayTitle}</h3>

      <p className="text-ink-muted max-w-md mx-auto mb-8 leading-relaxed">{displayMessage}</p>

      {onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center px-6 py-2.5 rounded-lg bg-surface-raised border border-line
            text-ink font-mono font-medium hover:text-brand hover:border-brand/40 hover:bg-brand/5
            transition-all duration-200 active:scale-95"
        >
          {displayActionLabel}
        </button>
      ) : (
        <Link
          to="/"
          className="inline-flex items-center px-6 py-2.5 rounded-lg bg-surface-raised border border-line
            text-ink font-mono font-medium hover:text-brand hover:border-brand/40 hover:bg-brand/5
            transition-all duration-200 active:scale-95"
        >
          {displayActionLabel}
        </Link>
      )}
    </div>
  );
}

import { usePassport } from '@/presentation/hooks/usePassport';
import { Bookmark, BookmarkCheck } from 'lucide-react';

export interface WatchlistButtonProps {
  movieId: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const SIZE_STYLES = {
  sm: {
    button: 'px-2.5 py-1 text-xs gap-1.5 rounded-md',
    icon: 'w-3.5 h-3.5',
  },
  md: {
    button: 'px-3.5 py-1.5 text-sm gap-2 rounded-lg',
    icon: 'w-4 h-4',
  },
  lg: {
    button: 'px-5 py-2.5 text-base gap-2.5 rounded-xl',
    icon: 'w-5 h-5',
  },
};

export function WatchlistButton({
  movieId,
  size = 'md',
  showLabel = true,
  className = '',
}: WatchlistButtonProps) {
  const { isWatchlisted, toggleWatchlist } = usePassport();
  const watchlisted = isWatchlisted(movieId);
  const sizeConfig = SIZE_STYLES[size];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    toggleWatchlist(movieId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={watchlisted ? 'Quitar de visas pendientes' : 'Guardar en visas pendientes'}
      aria-pressed={watchlisted}
      className={`inline-flex items-center justify-center font-mono font-medium transition-all duration-200 cursor-pointer border select-none active:scale-95 ${sizeConfig.button} ${
        watchlisted
          ? 'bg-parchment/20 text-parchment border-parchment/60 shadow-sm hover:bg-parchment/30'
          : 'bg-surface-raised text-ink-muted border-line hover:text-parchment hover:border-parchment/40 hover:bg-parchment/10'
      } ${className}`}
    >
      {watchlisted ? (
        <BookmarkCheck className={`${sizeConfig.icon} animate-in zoom-in-75 duration-150`} />
      ) : (
        <Bookmark className={sizeConfig.icon} />
      )}

      {showLabel && <span>{watchlisted ? 'Visa Concedida' : 'Visa Pendiente'}</span>}
    </button>
  );
}

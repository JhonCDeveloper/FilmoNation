import { usePassport } from '@/presentation/hooks/usePassport';
import { Check, Stamp } from 'lucide-react';

export interface StampButtonProps {
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

export function StampButton({
  movieId,
  size = 'md',
  showLabel = true,
  className = '',
}: StampButtonProps) {
  const { isStamped, toggleStamp } = usePassport();
  const stamped = isStamped(movieId);
  const sizeConfig = SIZE_STYLES[size];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    toggleStamp(movieId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={stamped ? 'Quitar sello del pasaporte' : 'Sellar película en pasaporte'}
      aria-pressed={stamped}
      className={`inline-flex items-center justify-center font-mono font-medium transition-all duration-200 cursor-pointer border select-none active:scale-95 ${sizeConfig.button} ${
        stamped
          ? 'bg-brand/20 text-brand border-brand shadow-sm shadow-brand/10 hover:bg-brand/30'
          : 'bg-surface-raised text-ink-muted border-line hover:text-brand hover:border-brand/60 hover:bg-brand/10'
      } ${className}`}
    >
      {stamped ? (
        <Check className={`${sizeConfig.icon} animate-in zoom-in-75 duration-150`} />
      ) : (
        <Stamp className={sizeConfig.icon} />
      )}

      {showLabel && <span>{stamped ? 'Sellado' : 'Sellar'}</span>}
    </button>
  );
}

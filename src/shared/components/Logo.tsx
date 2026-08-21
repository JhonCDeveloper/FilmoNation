export type LogoVariant = 'full' | 'icon';
export type LogoSize = 'sm' | 'md' | 'lg';

export interface FilmoNationLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
}

interface SizeConfig {
  seal: string;
  wordmark: string;
}

const SIZES: Record<LogoSize, SizeConfig> = {
  sm: { seal: 'w-8 h-8 text-xs', wordmark: 'text-base' },
  md: { seal: 'w-10 h-10 text-sm', wordmark: 'text-xl' },
  lg: { seal: 'w-14 h-14 text-lg', wordmark: 'text-2xl' },
};

export const FilmoNationLogo = ({
  variant = 'full',
  size = 'md',
  className = '',
}: FilmoNationLogoProps) => {
  const currentSize = SIZES[size];

  return (
    <a
      href="/"
      className={`inline-flex items-center gap-3 no-underline text-ink ${className}`}
      aria-label="FilmoNation Home"
    >
      {/* Sello circular */}
      <div
        className={`relative rounded-full flex items-center justify-center font-bold border border-brand text-brand ${currentSize.seal}`}
      >
        {/* Borde punteado interior */}
        <div className="absolute inset-0.75 rounded-full border border-dashed border-brand opacity-60 pointer-events-none" />
        <span>FN</span>
      </div>

      {/* Wordmark (Opcional según la variante) */}
      {variant === 'full' && (
        <div className={`tracking-wide select-none ${currentSize.wordmark}`}>
          <span>FILMO</span>
          <b className="font-semibold text-brand">NATION</b>
        </div>
      )}
    </a>
  );
};
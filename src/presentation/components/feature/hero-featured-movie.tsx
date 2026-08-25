import { Link } from 'react-router';
import { FileText } from 'lucide-react';
import { getTmdbImageUrl } from '@/shared/utils/image-url';
import { WatchlistButton } from '@/presentation/components/ui/watchlist-button';
import type { TmdbMovieSummary } from '@/infrastructure/api/types';

// ── Skeleton ─────────────────────────────────────────────────────────────────
export function HeroFeaturedMovieSkeleton() {
  return (
    <div
      className="flex gap-5 pl-4 border-l-2 border-brand/30 animate-pulse"
      aria-busy="true"
      aria-label="Cargando película de la semana"
    >
      {/* Miniatura */}
      <div className="flex-shrink-0 w-24 h-36 rounded-lg bg-panel" />

      {/* Texto */}
      <div className="flex flex-col gap-3 justify-center min-w-0">
        <div className="h-3 w-28 rounded bg-panel" />
        <div className="h-6 w-48 rounded bg-panel" />
        <div className="h-3 w-36 rounded bg-panel" />
        <div className="flex gap-3 mt-2">
          <div className="h-8 w-32 rounded-lg bg-panel" />
          <div className="h-8 w-32 rounded-lg bg-panel" />
        </div>
      </div>
    </div>
  );
}

// ── Corner brackets decorativos (estética visa) ───────────────────────────────
function CornerBrackets({ className = '' }: { className?: string }) {
  return (
    <span className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {/* TL */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-current" />
      {/* TR */}
      <span className="absolute top-0 right-0 w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-current" />
      {/* BL */}
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b-[1.5px] border-l-[1.5px] border-current" />
      {/* BR */}
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b-[1.5px] border-r-[1.5px] border-current" />
    </span>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
export interface HeroFeaturedMovieProps {
  movie: TmdbMovieSummary;
}

// ── Componente principal ──────────────────────────────────────────────────────
export function HeroFeaturedMovie({ movie }: HeroFeaturedMovieProps) {
  const posterUrl = getTmdbImageUrl(movie.poster_path, { size: 'w185' });
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '—';

  // Primer género aproximado a texto genérico ya que aquí solo tenemos IDs
  // Se muestra como dato secundario en la línea de metadatos
  const metaLine = `PELÍCULA DE LA SEMANA • ${rating} ★ • ${year}`;

  return (
    <div className="flex gap-5 pl-4 border-l-2 border-brand">
      {/* Miniatura del póster con acento de marca */}
      <div className="flex-shrink-0 w-24">
        <div className="relative w-24 rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full aspect-[2/3] object-cover block"
            loading="eager"
          />
          {/* Micro overlay dorado en borde inferior */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand/80 to-brand/20" />
        </div>
      </div>

      {/* Bloque editorial de texto */}
      <div className="flex flex-col justify-center gap-2 min-w-0">
        {/* Línea de metadatos monoespaciada */}
        <p className="font-mono text-[10px] text-brand tracking-[0.18em] uppercase truncate">
          {metaLine}
        </p>

        {/* Título en display serif */}
        <h2 className="font-display font-semibold text-xl leading-tight text-ink line-clamp-2">
          {movie.title}
        </h2>

        {/* Sinopsis abreviada */}
        {movie.overview && (
          <p className="text-xs text-ink-muted leading-relaxed line-clamp-2 max-w-xs">
            {movie.overview}
          </p>
        )}

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-2.5 mt-1">
          {/* Botón primario — Ver Ficha Completa */}
          <Link
            to={`/movie/${String(movie.id)}`}
            className="relative inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold
              tracking-widest uppercase bg-brand text-surface rounded-lg
              transition-all duration-200 hover:bg-brand/90 hover:shadow-[0_0_16px_rgba(186,158,89,0.4)]
              active:scale-95 select-none text-color-surface"
          >
            <CornerBrackets className="text-surface/60" />
            <FileText className="w-3.5 h-3.5 flex-shrink-0" />
            Ver Ficha
          </Link>

          {/* Botón secundario — WatchlistButton reutilizable */}
          <WatchlistButton movieId={movie.id} size="sm" showLabel />
        </div>
      </div>
    </div>
  );
}

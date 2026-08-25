import { useMemo } from 'react';
import type { TmdbMovieSummary } from '@/infrastructure/api/types';
import { getTmdbImageUrl } from '@/shared/utils/image-url';
import { usePassport } from '@/presentation/hooks/usePassport';
import { useMovieRecommendations, useTrendingMovies } from '@/presentation/hooks/useMovies';

// Configuración de columnas: offsetY controla el desfase en cascada
const FAN_COLUMNS = [
  { offsetY: '-6%', delay: '0s', duration: '6.2s' },
  { offsetY: '6%', delay: '-2.1s', duration: '5.7s' },
  { offsetY: '-3%', delay: '-4.4s', duration: '6.8s' },
] as const;

/**
 * Devuelve los primeros 3 elementos de un array después de aplicar un shuffle
 * de Fisher–Yates sobre una copia inmutable.
 * Puro: no accede a nada externo, no produce efectos secundarios observables.
 */
const seededPick = (movies: readonly TmdbMovieSummary[]): TmdbMovieSummary[] => {
  const copy: (TmdbMovieSummary | undefined)[] = movies.slice();
  let seed = movies.reduce((acc, m) => acc ^ m.id, 0xdeadbeef);
  const rand = () => {
    seed = (seed ^ (seed << 13)) >>> 0;
    seed = (seed ^ (seed >>> 7)) >>> 0;
    seed = (seed ^ (seed << 17)) >>> 0;
    return seed / 0x100000000;
  };
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy.filter((m): m is TmdbMovieSummary => m !== undefined).slice(0, 3);
};

interface PosterCardProps {
  movie: TmdbMovieSummary;
  offsetY: string;
  delay: string;
  duration: string;
}

function PosterCard({ movie, offsetY, delay, duration }: PosterCardProps) {
  const posterUrl = getTmdbImageUrl(movie.poster_path, { size: 'w500' });
  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : '';

  return (
    <div className="relative flex-shrink-0 w-40 md:w-48" style={{ marginTop: offsetY }}>
      <div
        className="group relative rounded-xl overflow-hidden cursor-pointer
          shadow-[0_8px_32px_rgba(0,0,0,0.55)]
          transition-all duration-500 ease-out
          hover:scale-105 hover:shadow-[0_12px_48px_rgba(186,158,89,0.35)]
          will-change-transform"
        style={{ animation: `levitate ${duration} ease-in-out ${delay} infinite` }}
      >
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover block select-none"
          loading="lazy"
          draggable={false}
        />

        {/* Borde dorado en hover */}
        <div className="absolute inset-0 rounded-xl ring-0 ring-brand/60 transition-all duration-500 group-hover:ring-2 pointer-events-none" />

        {/* Degradado inferior con metadatos — se revela en hover */}
        <div
          className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-12
            bg-gradient-to-t from-black/90 via-black/60 to-transparent
            translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out"
        >
          {releaseYear && (
            <span className="block font-mono text-brand text-xs mb-1 tracking-widest">
              {releaseYear}
            </span>
          )}
          <span className="block font-sans text-ink text-sm font-medium leading-tight line-clamp-2">
            {movie.title}
          </span>
        </div>
      </div>
    </div>
  );
}

function PosterSkeleton({ offsetY }: { offsetY: string }) {
  return (
    <div className="flex-shrink-0 w-40 md:w-48" style={{ marginTop: offsetY }}>
      <div className="w-full aspect-[2/3] rounded-xl bg-panel animate-pulse" />
    </div>
  );
}

export function HeroFan() {
  const { passport } = usePassport();

  const lastInteractedId =
    passport.stampedMovieIds.at(-1) ?? passport.watchlistMovieIds.at(-1) ?? 0;
  const hasActivity = lastInteractedId > 0;

  const { data: trending, isLoading: loadingTrending } = useTrendingMovies(1);
  const { data: recommended, isLoading: loadingRecommended } = useMovieRecommendations(
    lastInteractedId,
    1,
  );

  // seededPick es determinista dado el mismo pool de películas
  // — Math.random() nunca se llama dentro de useMemo
  const fanMovies = useMemo<TmdbMovieSummary[]>(() => {
    const recPool = recommended?.results;
    const trendPool = trending?.results;

    if (hasActivity && recPool && recPool.length >= 3) {
      return seededPick(recPool);
    }
    if (trendPool && trendPool.length >= 3) {
      return seededPick(trendPool);
    }
    return [];
  }, [hasActivity, recommended, trending]);

  const isLoading = hasActivity ? loadingRecommended || loadingTrending : loadingTrending;

  return (
    <>
      <style>{`
        @keyframes levitate {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-10px) rotate(0.4deg); }
          66%       { transform: translateY(4px) rotate(-0.3deg); }
        }
      `}</style>

      <div className="flex items-center gap-5 h-full">
        {isLoading || fanMovies.length === 0
          ? FAN_COLUMNS.map((col, i) => <PosterSkeleton key={i} offsetY={col.offsetY} />)
          : fanMovies.map((movie, i) => {
              const col = FAN_COLUMNS[i] ?? FAN_COLUMNS[0];
              return (
                <PosterCard
                  key={movie.id}
                  movie={movie}
                  offsetY={col.offsetY}
                  delay={col.delay}
                  duration={col.duration}
                />
              );
            })}
      </div>
    </>
  );
}

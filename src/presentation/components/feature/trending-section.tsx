import { Link } from 'react-router';
import { useTrendingMovies } from '@/presentation/hooks/useMovies';
import { AsyncBoundary } from '@/presentation/components/layout/async-boundary';
import { MovieCard } from '@/presentation/components/ui/movie-card';
import { MovieGridSkeleton } from '@/presentation/components/ui/movie-grid-skeleton';

export function TrendingSection() {
  const { data: trending, isLoading, isError, error, refetch } = useTrendingMovies(1);

  // Tomamos del índice 1 al 6 para obtener 5 películas y
  // evitar duplicar la película de la posición 0 que ya se muestra en el HeroFeaturedMovie.
  const movies = trending?.results.slice(1, 6) ?? [];

  return (
    <section className="flex flex-col gap-6">
      {/* Cabecera Editorial de Navegación */}
      <div className="flex items-end justify-between border-b border-line pb-4">
        <h2 className="font-display font-bold text-3xl text-ink">Tendencias de la semana</h2>

        <Link
          to="/territorio"
          className="font-mono text-xs font-bold text-brand uppercase tracking-widest border-b border-dashed border-brand/50 hover:border-brand transition-colors pb-0.5"
        >
          Ver todo en territorio &rarr;
        </Link>
      </div>

      {/* Orquestador de Estados de UI y Cuadrícula */}
      <AsyncBoundary
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        isEmpty={movies.length === 0}
        emptyType="initial"
        loadingFallback={<MovieGridSkeleton count={5} />}
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </AsyncBoundary>
    </section>
  );
}

/**
 * TerritoryPage — Catálogo filtrable de películas.
 *
 * Responsabilidades:
 * - Leer filtros desde URLSearchParams (fuente de verdad).
 * - Construir TmdbDiscoverParams y pasarlos a useDiscoverMovies.
 * - Cuando el usuario cambia de página, actualizar la URL.
 * - Delegar la captura de filtros a TerritoryFilterSidebar.
 */
import { useSearchParams } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDiscoverMovies, useSearchMovies } from '@/presentation/hooks/useMovies';
import { useMovieGenres } from '@/presentation/hooks/useMovies';
import { AsyncBoundary } from '@/presentation/components/layout/async-boundary';
import { MovieCard } from '@/presentation/components/ui/movie-card';
import { MovieGridSkeleton } from '@/presentation/components/ui/movie-grid-skeleton';
import { TerritoryFilterSidebar } from '@/presentation/components/feature/territory-filter-sidebar';
import type { FilterValues } from '@/presentation/components/feature/territory-filter-types';
import type { TmdbDiscoverParams } from '@/infrastructure/api/types';

// ── Conversión URL → parámetros TMDB ─────────────────────────────────────────

function buildDiscoverParams(searchParams: URLSearchParams): TmdbDiscoverParams {
  const params: TmdbDiscoverParams = {};

  const genre = searchParams.get('genre');
  const yearFrom = searchParams.get('yearFrom');
  const yearTo = searchParams.get('yearTo');
  const rating = searchParams.get('rating');
  const sortBy = searchParams.get('sort_by');
  const page = parseInt(searchParams.get('page') ?? '1', 10);

  if (genre) params.with_genres = genre;
  if (yearFrom) params['primary_release_date.gte'] = `${yearFrom}-01-01`;
  if (yearTo) params['primary_release_date.lte'] = `${yearTo}-12-31`;
  if (rating) params['vote_average.gte'] = parseFloat(rating);
  if (sortBy) params.sort_by = sortBy as NonNullable<TmdbDiscoverParams['sort_by']>;

  params['vote_count.gte'] = 50; // Filtro de calidad mínima
  params.page = isNaN(page) ? 1 : page;

  return params;
}

// ── Conversión FilterValues → URLSearchParams ─────────────────────────────────

function applyFiltersToUrl(
  values: FilterValues,
  setSearchParams: ReturnType<typeof useSearchParams>[1],
) {
  const next = new URLSearchParams();
  if (values.genre) next.set('genre', values.genre);
  if (values.yearFrom) next.set('yearFrom', values.yearFrom);
  if (values.yearTo) next.set('yearTo', values.yearTo);
  if (values.rating) next.set('rating', values.rating);
  if (values.sort_by) next.set('sort_by', values.sort_by);
  next.set('page', '1'); // Resetear a la primera página al filtrar
  setSearchParams(next, { replace: false });
}

// ── Paginación ────────────────────────────────────────────────────────────────

function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const clamped = Math.min(totalPages, 500); // TMDB tope duro
  if (clamped <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 pt-4">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => {
          onPageChange(page - 1);
        }}
        className="flex items-center gap-1 font-mono text-xs text-ink-muted hover:text-brand
          disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-brand rounded"
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        Anterior
      </button>

      <span className="font-mono text-xs text-ink-muted">
        {page} <span className="text-ink-muted/50">/ {clamped}</span>
      </span>

      <button
        type="button"
        disabled={page >= clamped}
        onClick={() => {
          onPageChange(page + 1);
        }}
        className="flex items-center gap-1 font-mono text-xs text-ink-muted hover:text-brand
          disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-brand rounded"
        aria-label="Página siguiente"
      >
        Siguiente
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────

export default function TerritoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') ?? '1', 10);
  const discoverParams = buildDiscoverParams(searchParams);

  // Leer el query de búsqueda libre (viene del HeaderSearch vía /territorio?q=...)
  const textQuery = searchParams.get('q') ?? '';
  const isSearchMode = textQuery.trim().length > 0;

  const {
    data: discoverData,
    isLoading: isDiscoverLoading,
    isError: isDiscoverError,
    error: discoverError,
    refetch: discoverRefetch,
  } = useDiscoverMovies(discoverParams, !isSearchMode);

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError,
    refetch: searchRefetch,
  } = useSearchMovies({ query: textQuery, page: discoverParams.page ?? 1 });

  const { data: genresData } = useMovieGenres();

  const data = isSearchMode ? searchData : discoverData;
  const isLoading = isSearchMode ? isSearchLoading : isDiscoverLoading;
  const isError = isSearchMode ? isSearchError : isDiscoverError;
  const error = isSearchMode ? searchError : discoverError;
  const refetch = isSearchMode ? searchRefetch : discoverRefetch;

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;

  // Valores actuales de la URL para pre-rellenar el sidebar
  const defaultFilterValues: Partial<FilterValues> = {
    genre: searchParams.get('genre') ?? '',
    yearFrom: searchParams.get('yearFrom') ?? '',
    yearTo: searchParams.get('yearTo') ?? '',
    rating: searchParams.get('rating') ?? '',
    sort_by: searchParams.get('sort_by') ?? 'popularity.desc',
  };

  const handleApply = (values: FilterValues) => {
    applyFiltersToUrl(values, setSearchParams);
  };

  const handleClear = () => {
    setSearchParams(new URLSearchParams(), { replace: false });
  };

  const handlePageChange = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(page));
    setSearchParams(next, { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera de Sección */}
      <div className="border-b border-line pb-4">
        <h1
          id="page-heading"
          tabIndex={-1}
          className="font-display font-bold text-4xl text-ink outline-none"
        >
          {textQuery ? (
            <>
              Resultados para <em className="text-brand font-normal">&ldquo;{textQuery}&rdquo;</em>
            </>
          ) : (
            'Territorio'
          )}
        </h1>
        {data && (
          <p className="font-mono text-xs text-ink-muted mt-1">
            {data.total_results.toLocaleString('es-ES')} expedientes encontrados
          </p>
        )}
      </div>

      {/* Layout Principal: Sidebar + Cuadrícula */}
      <div className="flex gap-8 items-start">
        {/* Sidebar de Filtros */}
        <TerritoryFilterSidebar
          genres={genresData?.genres ?? []}
          defaultValues={defaultFilterValues}
          onApply={handleApply}
          onClear={handleClear}
        />

        {/* Cuadrícula de Resultados */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <AsyncBoundary
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={() => {
              void refetch();
            }}
            isEmpty={movies.length === 0}
            emptyType="filtered"
            onEmptyAction={handleClear}
            emptyActionLabel="Limpiar filtros"
            loadingFallback={<MovieGridSkeleton count={20} />}
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </AsyncBoundary>

          <PaginationControls
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

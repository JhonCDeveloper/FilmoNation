import { useParams, useNavigate } from 'react-router';
import { ChevronLeft, Clock, Star, Calendar, DollarSign } from 'lucide-react';
import { useMovieDetails, useMovieRecommendations } from '@/presentation/hooks/useMovies';
import { AsyncBoundary } from '@/presentation/components/layout/async-boundary';
import { MovieCard } from '@/presentation/components/ui/movie-card';
import { StampButton } from '@/presentation/components/ui/stamp-button';
import { WatchlistButton } from '@/presentation/components/ui/watchlist-button';
import { ManageDossiersButton } from '@/presentation/components/feature/ManageDossiersButton';
import { getTmdbImageUrl } from '@/shared/utils/image-url';
import type { TmdbMovieDetailsResponse, TmdbVideo } from '@/infrastructure/api/types';

// ── Skeleton de la ficha completa ─────────────────────────────────────────────
function MovieDetailSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-10">
      {/* Cabecera inmersiva */}
      <div className="relative w-full h-[420px] bg-panel rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
        <div className="absolute bottom-8 left-8 flex gap-8">
          <div className="w-32 h-48 rounded-xl bg-surface-raised flex-shrink-0" />
          <div className="flex flex-col justify-end gap-3">
            <div className="h-5 w-40 rounded-full bg-surface-raised" />
            <div className="h-10 w-72 rounded-full bg-surface-raised" />
            <div className="h-4 w-52 rounded-full bg-surface-raised" />
            <div className="flex gap-3 mt-2">
              <div className="h-10 w-36 rounded-lg bg-surface-raised" />
              <div className="h-10 w-36 rounded-lg bg-surface-raised" />
            </div>
          </div>
        </div>
      </div>
      {/* Sinopsis */}
      <div className="flex flex-col gap-3">
        <div className="h-4 w-full rounded-full bg-panel" />
        <div className="h-4 w-5/6 rounded-full bg-panel" />
        <div className="h-4 w-4/6 rounded-full bg-panel" />
      </div>
    </div>
  );
}

// ── Formato de moneda USD ─────────────────────────────────────────────────────
function formatUSD(amount: number): string {
  if (amount === 0) return 'N/D';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
}

// ── Formato de duración ───────────────────────────────────────────────────────
function formatRuntime(minutes: number | null): string {
  if (!minutes) return 'N/D';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${String(h)}h ${String(m)}m` : `${String(m)}m`;
}

// ── Datos del tráiler oficial ─────────────────────────────────────────────────
function findOfficialTrailer(videos: TmdbVideo[]): TmdbVideo | undefined {
  // Prioridad: Official Trailer → cualquier Trailer → Teaser
  return (
    videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ??
    videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ??
    videos.find((v) => v.site === 'YouTube' && v.type === 'Teaser')
  );
}

// ── Vista interna de la ficha (ya con datos) ──────────────────────────────────
function MovieDetailView({ movie }: { movie: TmdbMovieDetailsResponse }) {
  const backdropUrl = getTmdbImageUrl(movie.backdrop_path, { size: 'original' });
  const posterUrl = getTmdbImageUrl(movie.poster_path, { size: 'w342' });
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—';
  const trailer = movie.videos ? findOfficialTrailer(movie.videos.results) : undefined;
  const cast = movie.credits?.cast.slice(0, 8) ?? [];
  const director = movie.credits?.crew.find((c) => c.job === 'Director');

  const {
    data: recommendations,
    isLoading: recsLoading,
    isError: recsError,
    error: recsErr,
    refetch: recsRefetch,
  } = useMovieRecommendations(movie.id);

  const recoMovies = recommendations?.results.slice(0, 5) ?? [];

  return (
    <article className="flex flex-col gap-12 pb-16">
      {/* ── 1. Cabecera Inmersiva ────────────────────────────────────────────── */}
      <div className="relative w-full min-h-[420px]">
        {/* Capas de fondo (clipadas con overflow-hidden para respetar rounded-2xl) */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          {/* Backdrop borroso como fondo */}
          {movie.backdrop_path && (
            <img
              src={backdropUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover scale-105 blur-sm opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/80 via-transparent to-transparent" />
        </div>

        {/* Contenido sobre el fondo */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-8 p-8 items-end h-full min-h-[420px]">
          {/* Póster en alta resolución */}
          <div className="flex-shrink-0 w-36 shadow-[0_8px_32px_rgba(0,0,0,0.7)] rounded-xl overflow-hidden hidden sm:block">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover block"
            />
          </div>

          {/* Datos de cabecera */}
          <div className="flex flex-col gap-3 pb-2">
            {/* Géneros en mono */}
            <p className="font-mono text-[11px] text-brand tracking-[0.2em] uppercase">
              {movie.genres.map((g) => g.name).join(' • ')}
            </p>

            {/* Título — destino de foco en transición de ruta */}
            <h1
              id="page-heading"
              tabIndex={-1}
              className="font-display font-bold text-4xl lg:text-5xl text-ink leading-tight max-w-2xl outline-none"
            >
              {movie.title}
            </h1>

            {/* Tagline */}
            {movie.tagline && (
              <p className="font-display italic text-ink-muted text-lg">
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}

            {/* Metadatos en línea */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs text-ink-muted mt-1">
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-brand" />
                {movie.vote_average.toFixed(1)} ({movie.vote_count.toLocaleString()} votos)
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-ink-muted/70" />
                {year}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-ink-muted/70" />
                {formatRuntime(movie.runtime)}
              </span>
            </div>

            {/* CTAs de Pasaporte */}
            <div className="flex flex-wrap gap-3 mt-2">
              <StampButton movieId={movie.id} size="lg" showLabel />
              <WatchlistButton movieId={movie.id} size="lg" showLabel />
              <ManageDossiersButton movieId={movie.id} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Sinopsis ─────────────────────────────────────────────────────── */}
      {movie.overview && (
        <section className="flex flex-col gap-3">
          <h2 className="font-mono text-xs text-brand tracking-[0.2em] uppercase border-l-2 border-brand pl-3">
            SINOPSIS DEL EXPEDIENTE
          </h2>
          <p className="text-ink-muted leading-relaxed max-w-3xl text-base">{movie.overview}</p>
        </section>
      )}

      {/* ── 3. Tráiler Oficial ───────────────────────────────────────────────── */}
      {trailer && (
        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-xs text-brand tracking-[0.2em] uppercase border-l-2 border-brand pl-3">
            REGISTRO AUDIOVISUAL
          </h2>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-panel max-w-3xl">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailer.key}?rel=0&modestbranding=1`}
              title={trailer.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </section>
      )}

      {/* ── 4. Elenco Principal ──────────────────────────────────────────────── */}
      {cast.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-xs text-brand tracking-[0.2em] uppercase border-l-2 border-brand pl-3">
            CUERPO DIPLOMÁTICO
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {cast.map((actor) => (
              <div
                key={actor.id}
                className="group flex flex-col overflow-hidden rounded-xl bg-surface-raised border border-line transition-transform duration-300 hover:scale-[1.03] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
              >
                {/* Fotografía de retrato (3:4) */}
                <div className="w-full aspect-[3/4] bg-surface-raised overflow-hidden">
                  {actor.profile_path ? (
                    <img
                      src={getTmdbImageUrl(actor.profile_path, { size: 'w185' })}
                      alt={actor.name}
                      className="w-full h-full object-cover block"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink-muted/30">
                      ?
                    </div>
                  )}
                </div>

                {/* Tipografía Sans-Serif Humanista */}
                <div className="flex flex-col gap-0.5 p-3">
                  <p
                    className="font-sans font-semibold text-xs leading-snug text-ink line-clamp-1"
                    title={actor.name}
                  >
                    {actor.name}
                  </p>
                  <p
                    className="font-sans text-[11px] leading-snug text-ink-muted line-clamp-2"
                    title={actor.character}
                  >
                    {actor.character}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 5. Ficha Administrativa ──────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs text-brand tracking-[0.2em] uppercase border-l-2 border-brand pl-3">
          FICHA ADMINISTRATIVA
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {director && (
            <div className="flex flex-col gap-1 p-4 rounded-lg bg-surface-raised border border-line">
              <p className="font-mono text-[10px] text-ink-muted uppercase tracking-widest">
                Dirección
              </p>
              <p className="font-display text-sm text-ink font-medium">{director.name}</p>
            </div>
          )}
          <div className="flex flex-col gap-1 p-4 rounded-lg bg-surface-raised border border-line">
            <p className="font-mono text-[10px] text-ink-muted uppercase tracking-widest">Estado</p>
            <p className="font-display text-sm text-ink font-medium">{movie.status}</p>
          </div>
          <div className="flex flex-col gap-1 p-4 rounded-lg bg-surface-raised border border-line">
            <p className="font-mono text-[10px] text-ink-muted uppercase tracking-widest flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Presupuesto
            </p>
            <p className="font-display text-sm text-ink font-medium">{formatUSD(movie.budget)}</p>
          </div>
          <div className="flex flex-col gap-1 p-4 rounded-lg bg-surface-raised border border-line">
            <p className="font-mono text-[10px] text-ink-muted uppercase tracking-widest flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Recaudación
            </p>
            <p className="font-display text-sm text-ink font-medium">{formatUSD(movie.revenue)}</p>
          </div>
        </div>
      </section>

      {/* ── 6. Territorios Similares ─────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between border-b border-line pb-4">
          <h2 className="font-display font-bold text-2xl text-ink">Territorios Similares</h2>
        </div>

        <AsyncBoundary
          isLoading={recsLoading}
          isError={recsError}
          error={recsErr}
          onRetry={() => void recsRefetch()}
          isEmpty={recoMovies.length === 0}
          emptyType="initial"
          emptyActionLabel="Volver al Inicio"
        >
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {recoMovies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </AsyncBoundary>
      </section>
    </article>
  );
}

// ── Componente principal de la página ─────────────────────────────────────────
export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = id ? parseInt(id, 10) : 0;

  const { data: movie, isLoading, isError, error, refetch } = useMovieDetails(movieId);

  return (
    <div className="flex flex-col gap-6">
      {/* Botón Volver */}
      <button
        type="button"
        onClick={() => {
          void navigate(-1);
        }}
        className="inline-flex items-center gap-2 font-mono text-xs text-ink-muted hover:text-brand transition-colors w-fit"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver al territorio
      </button>

      <AsyncBoundary
        isLoading={isLoading || movieId === 0}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        loadingFallback={<MovieDetailSkeleton />}
      >
        {movie && <MovieDetailView movie={movie} />}
      </AsyncBoundary>
    </div>
  );
}

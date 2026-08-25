import { Link } from 'react-router';
import type { TmdbMovieSummary } from '@/infrastructure/api/types';
import { getTmdbImageUrl } from '@/shared/utils/image-url';
import { usePassport } from '@/presentation/hooks/usePassport';
import { useMovieGenres } from '@/presentation/hooks/useMovies';
import { fmtRating, fmtVoteCount, fmtYear, isUpcoming } from '@/shared/i18n/formatters';
import { UI } from '@/shared/i18n/messages';

export interface MovieCardProps {
  movie: TmdbMovieSummary;
}

export function MovieCard({ movie }: MovieCardProps) {
  const { isStamped, isWatchlisted } = usePassport();
  const { data: genresData } = useMovieGenres();

  const stamped = isStamped(movie.id);
  const watchlisted = isWatchlisted(movie.id);
  const upcoming = isUpcoming(movie.release_date);

  const posterUrl = getTmdbImageUrl(movie.poster_path, { size: 'w342' });

  // ── Metadatos ────────────────────────────────────────────────────────────────
  const year = fmtYear(movie.release_date);
  const rating = fmtRating(movie.vote_average);
  const voteCount = fmtVoteCount(movie.vote_count);

  const primaryGenreId = movie.genre_ids[0];
  const genreName =
    primaryGenreId && genresData
      ? (genresData.genres.find((g) => g.id === primaryGenreId)?.name ?? null)
      : null;

  const metaParts: string[] = [year];
  if (genreName) metaParts.push(genreName);
  const metaLine = metaParts.join(' · ');

  // ── Estampa de pasaporte ─────────────────────────────────────────────────────
  const sticker: string | null = stamped
    ? UI.passport.stamped
    : watchlisted
      ? UI.passport.watchlisted
      : null;

  // ── Aria-label compuesto para lectores de pantalla ───────────────────────────
  const ariaLabel = UI.a11y.movieCard({
    title: movie.title,
    year,
    rating,
    upcoming,
    stamped,
    watchlisted,
  });

  return (
    <Link
      to={`/movie/${String(movie.id)}`}
      aria-label={ariaLabel}
      className="group flex flex-col gap-2.5 outline-none"
    >
      {/* ── Póster con reserva de aspecto (Zero CLS) ─────────────────────────── */}
      <div
        className={`relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-surface-raised
          transition-transform duration-300
          group-hover:scale-[1.02] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)]
          group-focus-visible:ring-2 group-focus-visible:ring-brand
          ${upcoming ? 'ring-1 ring-brand/40' : ''}`}
      >
        {/* Alt vacío porque el aria-label del <Link> ya describe la entidad completa */}
        <img
          src={posterUrl}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover block"
          loading="lazy"
          decoding="async"
        />

        {/* Insignia de calificación circular — aria-hidden porque ya está en el aria-label */}
        <div
          className="absolute top-2 left-2 flex items-center justify-center w-9 h-9 rounded-full
            bg-surface/75 backdrop-blur-md border border-brand/70 shadow-sm"
          aria-hidden="true"
        >
          <span className="font-mono text-xs font-bold text-ink leading-none">{rating}</span>
        </div>

        {/* Insignia PRÓXIMO — texto explícito, no solo color */}
        {upcoming && !stamped && (
          <div className="absolute top-2 right-2 pointer-events-none" aria-hidden="true">
            <span
              className="font-mono text-[9px] font-bold tracking-widest uppercase
              px-1.5 py-0.5 bg-brand/90 text-surface rounded-sm shadow-sm"
            >
              {UI.passport.upcoming}
            </span>
          </div>
        )}

        {/* Estampas de pasaporte — aria-hidden porque ya está en el aria-label */}
        {sticker && (
          <div
            className="absolute bottom-3 right-2 rotate-[-12deg] pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="px-2.5 py-1 border-2 border-danger text-danger
              font-mono font-bold text-[9px] tracking-widest uppercase
              bg-surface/85 backdrop-blur-sm shadow-md"
            >
              {sticker}
            </div>
          </div>
        )}
      </div>

      {/* ── Pie de expediente: jerarquía de tres niveles ────────────────────── */}
      {/* aria-hidden porque el aria-label del Link ya lo incluye todo */}
      <div className="flex flex-col gap-1 px-0.5" aria-hidden="true">
        {/* Nivel 1 — Identidad */}
        <h3
          className="font-sans font-semibold text-sm text-ink truncate
            group-hover:text-brand transition-colors duration-200"
          title={movie.title}
        >
          {movie.title}
        </h3>

        {/* Nivel 2 — Contexto técnico */}
        <p className="font-mono text-[11px] text-ink-muted truncate">{metaLine}</p>

        {/* Nivel 3 — Valoración crítica */}
        <p className="font-mono text-[11px] text-ink-muted/70">
          <span className="text-ink font-bold">{rating}</span>
          <span className="text-ink-muted/50">{UI.rating.outOf}</span>
          {' · '}
          {voteCount}
        </p>
      </div>
    </Link>
  );
}

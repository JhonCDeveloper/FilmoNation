import { useTrendingMovies } from '../hooks/useMovies';
import { HeroFan } from '../components/feature/hero-fan';
import {
  HeroFeaturedMovie,
  HeroFeaturedMovieSkeleton,
} from '../components/feature/hero-featured-movie';
import { TrendingSection } from '../components/feature/trending-section';

export default function Home() {
  // Reutilizamos trending (cacheado) para elegir la película de la semana.
  // La primera posición de trending es siempre la más relevante del momento.
  const { data: trending, isLoading } = useTrendingMovies(1);
  const featuredMovie = trending?.results[0];

  return (
    <div className="flex flex-col gap-8">
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="flex w-full items-start gap-12 border-b border-line pb-14 pt-10 min-h-[520px]">
        {/* Columna izquierda: Titular + Ficha Destacada */}
        <div className="flex-1 flex flex-col gap-10">
          {/* Titular */}
          <div>
            <h1
              id="page-heading"
              tabIndex={-1}
              className="font-display font-bold text-6xl xl:text-7xl leading-[1.05] outline-none"
            >
              Toda película es <br />
              un territorio.
              <br />
              <em className="text-brand font-normal">Conquista el tuyo.</em>
            </h1>

            <p className="mt-6 text-base text-ink-muted max-w-md leading-relaxed">
              FilmoNation no te recomienda qué ver: te da papeles para entrar. Explora el archivo,
              guarda visas pendientes y sella tu pasaporte cada vez que termines una.
            </p>
          </div>

          {/* Ficha Destacada */}
          {isLoading || !featuredMovie ? (
            <HeroFeaturedMovieSkeleton />
          ) : (
            <HeroFeaturedMovie movie={featuredMovie} />
          )}
        </div>

        {/* Columna derecha: Abanico Dinámico */}
        <div className="hidden md:flex items-center justify-end flex-shrink-0 pt-4">
          <HeroFan />
        </div>
      </section>

      {/* ── Tendencias ───────────────────────────────────────────────────────── */}
      <TrendingSection />
    </div>
  );
}

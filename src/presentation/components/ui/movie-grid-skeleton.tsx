// src/presentation/components/ui/movie-grid-skeleton.tsx
export function MovieCardSkeleton() {
  return (
    <div
      className="flex flex-col gap-3 animate-pulse"
      aria-busy="true"
      aria-label="Cargando película..."
    >
      {/* Póster */}
      <div className="w-full aspect-[2/3] rounded-xl bg-panel" />

      {/* Contenido inferior */}
      <div className="flex flex-col gap-2 px-1">
        {/* Metadatos (año/géneros) */}
        <div className="h-3 w-1/3 rounded-full bg-panel" />

        {/* Título */}
        <div className="h-4 w-3/4 rounded-full bg-panel" />

        {/* Botones de acción */}
        <div className="flex items-center gap-2 mt-2">
          <div className="h-8 w-24 rounded-lg bg-panel" />
          <div className="h-8 w-8 rounded-lg bg-panel" />
        </div>
      </div>
    </div>
  );
}

export interface MovieGridSkeletonProps {
  count?: number;
}

export function MovieGridSkeleton({ count = 12 }: MovieGridSkeletonProps) {
  return (
    <div
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      role="status"
      aria-label="Cargando lista de películas"
    >
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}

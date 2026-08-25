/**
 * TerritoryFilterSidebar — Formulario de filtros del catálogo.
 *
 * Responsabilidades:
 * - Capturar parámetros (género, año desde/hasta, calificación mínima, ordenación).
 * - Al hacer submit → serializar en URLSearchParams y notificar al padre.
 * - Al limpiar → reset del formulario + notificar al padre para limpiar la URL.
 *
 * NO consulta TMDB: solo gestiona el formulario.
 */
import { useForm } from 'react-hook-form';
import { SlidersHorizontal, X } from 'lucide-react';
import type { TmdbGenre } from '@/infrastructure/api/types';
import { type FilterValues, SORT_OPTIONS } from './territory-filter-types';

interface TerritoryFilterSidebarProps {
  genres: TmdbGenre[];
  defaultValues: Partial<FilterValues>;
  onApply: (values: FilterValues) => void;
  onClear: () => void;
}

export function TerritoryFilterSidebar({
  genres,
  defaultValues,
  onApply,
  onClear,
}: TerritoryFilterSidebarProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<FilterValues>({
    defaultValues: {
      genre: '',
      yearFrom: '',
      yearTo: '',
      rating: '',
      sort_by: 'popularity.desc',
      ...defaultValues,
    },
  });

  const handleClear = () => {
    reset({
      genre: '',
      yearFrom: '',
      yearTo: '',
      rating: '',
      sort_by: 'popularity.desc',
    });
    onClear();
  };

  return (
    <aside className="flex-shrink-0 w-64 flex flex-col gap-6">
      {/* Cabecera del formulario */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-mono text-xs text-brand tracking-[0.2em] uppercase">
          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
          Filtros
        </h2>
        {isDirty && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 font-mono text-[10px] text-ink-muted hover:text-danger transition-colors"
          >
            <X className="w-3 h-3" aria-hidden="true" />
            Limpiar
          </button>
        )}
      </div>

      {/* Formulario No Controlado */}
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(onApply)} className="flex flex-col gap-5" noValidate>
        {/* Ordenar por */}
        <fieldset className="flex flex-col gap-2">
          <legend className="font-mono text-[10px] text-ink-muted uppercase tracking-widest">
            Ordenar por
          </legend>
          <select
            {...register('sort_by')}
            className="w-full bg-surface-raised border border-line rounded-lg px-3 py-2 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </fieldset>

        {/* Género */}
        <fieldset className="flex flex-col gap-2">
          <legend className="font-mono text-[10px] text-ink-muted uppercase tracking-widest">
            Género
          </legend>
          <select
            {...register('genre')}
            className="w-full bg-surface-raised border border-line rounded-lg px-3 py-2 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">Todos</option>
            {genres.map((g) => (
              <option key={g.id} value={String(g.id)}>
                {g.name}
              </option>
            ))}
          </select>
        </fieldset>

        {/* Rango de Año */}
        <fieldset className="flex flex-col gap-2">
          <legend className="font-mono text-[10px] text-ink-muted uppercase tracking-widest">
            Año de estreno
          </legend>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Desde"
              min={1900}
              max={2030}
              {...register('yearFrom', { min: 1900, max: 2030 })}
              className="w-1/2 bg-surface-raised border border-line rounded-lg px-2 py-2 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-brand placeholder:text-ink-muted/50"
              aria-label="Año desde"
            />
            <input
              type="number"
              placeholder="Hasta"
              min={1900}
              max={2030}
              {...register('yearTo', { min: 1900, max: 2030 })}
              className="w-1/2 bg-surface-raised border border-line rounded-lg px-2 py-2 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-brand placeholder:text-ink-muted/50"
              aria-label="Año hasta"
            />
          </div>
        </fieldset>

        {/* Calificación Mínima */}
        <fieldset className="flex flex-col gap-2">
          <legend className="font-mono text-[10px] text-ink-muted uppercase tracking-widest">
            Calificación mínima
          </legend>
          <select
            {...register('rating')}
            className="w-full bg-surface-raised border border-line rounded-lg px-3 py-2 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">Cualquiera</option>
            {[9, 8, 7, 6, 5].map((n) => (
              <option key={n} value={String(n)}>
                ≥ {n}.0
              </option>
            ))}
          </select>
        </fieldset>

        {/* CTA principal */}
        <button
          type="submit"
          className="relative w-full py-2.5 px-4 bg-brand text-surface font-mono font-bold text-xs tracking-widest uppercase rounded-lg
            hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface
            transition-colors"
        >
          {/* Corner brackets */}
          <span
            className="absolute top-1 left-1 w-2 h-2 border-t border-l border-surface/40"
            aria-hidden="true"
          />
          <span
            className="absolute top-1 right-1 w-2 h-2 border-t border-r border-surface/40"
            aria-hidden="true"
          />
          Sellar Filtros
        </button>

        {/* Botón limpiar alternativo (siempre visible abajo) */}
        <button
          type="button"
          onClick={handleClear}
          className="w-full py-2 px-4 border border-line text-ink-muted font-mono text-[10px] tracking-widest uppercase rounded-lg
            hover:border-danger hover:text-danger focus:outline-none focus:ring-2 focus:ring-danger/50
            transition-colors"
        >
          Limpiar filtros
        </button>
      </form>
    </aside>
  );
}

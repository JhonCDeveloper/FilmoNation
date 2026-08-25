/**
 * territory-filter-types.ts — Tipos y constantes compartidos del módulo de territorio.
 * Separado del componente para satisfacer react-refresh/only-export-components.
 */

export interface FilterValues {
  genre: string;
  yearFrom: string;
  yearTo: string;
  rating: string;
  sort_by: string;
}

export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'popularity.desc', label: 'Más populares' },
  { value: 'vote_average.desc', label: 'Mejor valoradas' },
  { value: 'primary_release_date.desc', label: 'Más recientes' },
  { value: 'primary_release_date.asc', label: 'Más antiguas' },
  { value: 'revenue.desc', label: 'Mayor recaudación' },
];

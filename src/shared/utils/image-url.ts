import { env } from '@/config/env';

export type TmdbPosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';

export type TmdbBackdropSize = 'w300' | 'w780' | 'w1280' | 'original';

export type TmdbProfileSize = 'w45' | 'w185' | 'h632' | 'original';

export type TmdbImageSize = TmdbPosterSize | TmdbBackdropSize | TmdbProfileSize;

// Fallback limpio en formato SVG Data URI alineado a la estética de FilmoNation
const PLACEHOLDER_POSTER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750" fill="none">
  <rect width="500" height="750" fill="#1e1c24"/>
  <rect x="2" y="2" width="496" height="746" fill="none" stroke="#322f3d" stroke-width="2"/>
  <circle cx="250" cy="340" r="48" stroke="#ba9e59" stroke-width="2" stroke-dasharray="6 6"/>
  <text x="250" y="345" text-anchor="middle" fill="#ba9e59" font-family="monospace" font-size="20" font-weight="bold">FN</text>
  <text x="250" y="440" text-anchor="middle" fill="#aa9eaf" font-family="sans-serif" font-size="16">Imagen no disponible</text>
</svg>
`)}`;

const PLACEHOLDER_BACKDROP = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" fill="none">
  <rect width="1280" height="720" fill="#1e1c24"/>
  <rect x="4" y="4" width="1272" height="712" fill="none" stroke="#322f3d" stroke-width="2"/>
  <circle cx="640" cy="330" r="56" stroke="#ba9e59" stroke-width="2" stroke-dasharray="6 6"/>
  <text x="640" y="337" text-anchor="middle" fill="#ba9e59" font-family="monospace" font-size="24" font-weight="bold">FN</text>
  <text x="640" y="430" text-anchor="middle" fill="#aa9eaf" font-family="sans-serif" font-size="18">Sin imagen de fondo</text>
</svg>
`)}`;

export interface FormatTmdbImageOptions {
  size?: TmdbImageSize;
  type?: 'poster' | 'backdrop' | 'profile';
}

/**
 * Formatea una ruta relativa de TMDB a su URL segura HTTPS completa o devuelve un fallback SVG.
 *
 * @param path Ruta entregada por la API (ej: "/kqjL17yXxvn9ovLyXYuTYrGfakM.jpg")
 * @param options Opciones de tamaño ('w500', 'w780', 'original') y tipo ('poster' | 'backdrop' | 'profile')
 * @returns URL HTTPS formateada o SVG Data URI fallback
 */
export function getTmdbImageUrl(
  path?: string | null,
  options: FormatTmdbImageOptions = {},
): string {
  if (!path || path.trim() === '') {
    return options.type === 'backdrop' ? PLACEHOLDER_BACKDROP : PLACEHOLDER_POSTER;
  }

  const defaultSize = options.type === 'backdrop' ? 'w780' : 'w500';
  const size = options.size ?? defaultSize;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const baseUrl = env.VITE_TMDB_IMAGE_BASE.replace(/\/+$/, '');

  return `${baseUrl}/${size}${cleanPath}`;
}

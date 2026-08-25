export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbErrorPayload {
  status_code: number;
  status_message: string;
}

// 1. GET /configuration
export interface TmdbConfigurationResponse {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
  change_keys: string[];
}

// 2. GET /genre/movie/list
export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbGenreListResponse {
  genres: TmdbGenre[];
}

// Modelo base para películas en listas (Discover, Search, Trending, Recommendations)
export interface TmdbMovieSummary {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  video: boolean;
  original_language: string;
}

// 5. GET /movie/{id} (elenco y trailers incluidos vía append_to_response)
export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TmdbMovieDetailsResponse extends Omit<TmdbMovieSummary, 'genre_ids'> {
  genres: TmdbGenre[];
  tagline: string | null;
  runtime: number | null;
  budget: number;
  revenue: number;
  status: string;
  credits?: {
    cast: TmdbCastMember[];
    crew: { id: number; name: string; job: string }[];
  };
  videos?: {
    results: TmdbVideo[];
  };
}

// Parámetros para Discover y Search
export interface TmdbDiscoverParams {
  page?: number;
  with_genres?: string;
  primary_release_year?: number;
  /** Fecha mínima de estreno (YYYY-MM-DD) — para rangos de año */
  'primary_release_date.gte'?: string;
  /** Fecha máxima de estreno (YYYY-MM-DD) — para rangos de año */
  'primary_release_date.lte'?: string;
  'vote_average.gte'?: number;
  'vote_count.gte'?: number;
  sort_by?:
    | 'popularity.desc'
    | 'popularity.asc'
    | 'vote_average.desc'
    | 'vote_average.asc'
    | 'primary_release_date.desc'
    | 'primary_release_date.asc'
    | 'revenue.desc'
    | 'revenue.asc';
}

export interface TmdbSearchParams {
  query: string;
  page?: number;
}

// Regla de Negocio: TMDB tiene un tope duro de 500 páginas
export const MAX_TMDB_PAGES = 500;

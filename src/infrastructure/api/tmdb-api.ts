import { httpClient } from '../http/http-client';
import {
  MAX_TMDB_PAGES,
  type PaginatedResponse,
  type TmdbConfigurationResponse,
  type TmdbDiscoverParams,
  type TmdbGenreListResponse,
  type TmdbMovieDetailsResponse,
  type TmdbMovieSummary,
  type TmdbSearchParams,
} from './types';

export const tmdbApi = {
  // 1. GET /configuration (Base y tamaños de imágenes - pedir una vez y cachear)
  getConfiguration: (): Promise<TmdbConfigurationResponse> => {
    return httpClient.get<TmdbConfigurationResponse>('/3/configuration');
  },

  // 2. GET /genre/movie/list (Catálogo de géneros para filtros)
  getGenres: (): Promise<TmdbGenreListResponse> => {
    return httpClient.get<TmdbGenreListResponse>('/3/genre/movie/list');
  },

  // 3. GET /discover/movie (Descubrimiento con filtros)
  discoverMovies: (
    params: TmdbDiscoverParams = {},
  ): Promise<PaginatedResponse<TmdbMovieSummary>> => {
    const page = Math.min(params.page ?? 1, MAX_TMDB_PAGES);
    return httpClient.get<PaginatedResponse<TmdbMovieSummary>>('/3/discover/movie', {
      params: { ...params, page },
    });
  },

  // 4. GET /search/movie (Búsqueda por texto)
  searchMovies: (params: TmdbSearchParams): Promise<PaginatedResponse<TmdbMovieSummary>> => {
    const page = Math.min(params.page ?? 1, MAX_TMDB_PAGES);
    return httpClient.get<PaginatedResponse<TmdbMovieSummary>>('/3/search/movie', {
      params: { ...params, page },
    });
  },

  // 5. GET /movie/{id} (Ficha completa con elenco y tráilers en la misma petición)
  getMovieDetails: (id: number): Promise<TmdbMovieDetailsResponse> => {
    return httpClient.get<TmdbMovieDetailsResponse>(`/3/movie/${String(id)}`, {
      params: { append_to_response: 'credits,videos' },
    });
  },

  // 6. GET /movie/{id}/recommendations (Recomendadas para la ficha)
  getMovieRecommendations: (id: number, page = 1): Promise<PaginatedResponse<TmdbMovieSummary>> => {
    const clampedPage = Math.min(page, MAX_TMDB_PAGES);
    return httpClient.get<PaginatedResponse<TmdbMovieSummary>>(
      `/3/movie/${String(id)}/recommendations`,
      {
        params: { page: clampedPage },
      },
    );
  },

  // 7. GET /trending/movie/week (Portada de inicio)
  getTrendingMovies: (page = 1): Promise<PaginatedResponse<TmdbMovieSummary>> => {
    const clampedPage = Math.min(page, MAX_TMDB_PAGES);
    return httpClient.get<PaginatedResponse<TmdbMovieSummary>>('/3/trending/movie/week', {
      params: { page: clampedPage },
    });
  },
};

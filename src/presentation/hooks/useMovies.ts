import { tmdbApi } from '@/infrastructure/api/tmdb-api';
import type { TmdbDiscoverParams, TmdbSearchParams } from '@/infrastructure/api/types';
import { movieKeys } from './query-keys';
import { useAppQuery } from './useAppQuery';

// 1. GET /configuration (Excepción del contrato: Se pide 1 vez y no caduca durante la sesión)
export const useTmdbConfiguration = () => {
  return useAppQuery(movieKeys.configuration(), () => tmdbApi.getConfiguration(), {
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

// 2. GET /genre/movie/list (Catálogo de géneros: Copia que caduca a las 24 horas)
export const useMovieGenres = () => {
  return useAppQuery(movieKeys.genres(), () => tmdbApi.getGenres(), {
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
  });
};

// 3. GET /trending/movie/week (Portada: Copia que caduca a los 15 minutos)
export const useTrendingMovies = (page = 1) => {
  return useAppQuery(movieKeys.trending(page), () => tmdbApi.getTrendingMovies(page), {
    staleTime: 1000 * 60 * 15, // 15 minutos
  });
};

// 4. GET /discover/movie (Filtros: Copia que caduca a los 5 minutos)
export const useDiscoverMovies = (params?: TmdbDiscoverParams, enabled = true) => {
  return useAppQuery(movieKeys.discover(params), () => tmdbApi.discoverMovies(params), {
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// 5. GET /search/movie (Búsquedas: Copia que caduca a los 5 minutos)
export const useSearchMovies = (params: TmdbSearchParams) => {
  return useAppQuery(movieKeys.search(params), () => tmdbApi.searchMovies(params), {
    enabled: params.query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// 6. GET /movie/{id} (Ficha de película: Copia que caduca a los 10 minutos)
export const useMovieDetails = (id: number) => {
  return useAppQuery(movieKeys.detail(id), () => tmdbApi.getMovieDetails(id), {
    enabled: id > 0,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
};

// 7. GET /movie/{id}/recommendations (Recomendadas: Copia que caduca a los 10 minutos)
export const useMovieRecommendations = (id: number, page = 1) => {
  return useAppQuery(
    movieKeys.recommendations(id, page),
    () => tmdbApi.getMovieRecommendations(id, page),
    {
      enabled: id > 0,
      staleTime: 1000 * 60 * 10, // 10 minutos
    },
  );
};

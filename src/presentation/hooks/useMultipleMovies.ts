import { useQueries } from '@tanstack/react-query';
import { tmdbApi } from '@/infrastructure/api/tmdb-api';
import { movieKeys } from './query-keys';

export const useMultipleMovies = (movieIds: number[]) => {
  return useQueries({
    queries: movieIds.map((id) => ({
      queryKey: movieKeys.detail(id),
      queryFn: () => tmdbApi.getMovieDetails(id),
      staleTime: 1000 * 60 * 10, // 10 minutos
      enabled: id > 0,
    })),
  });
};

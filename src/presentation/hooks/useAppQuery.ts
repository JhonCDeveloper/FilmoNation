// src/presentation/hooks/use-app-query.ts
import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { HttpError } from '@/infrastructure/http/http-error';

type AppQueryOptions<TData> = Omit<
  UseQueryOptions<TData, HttpError, TData>,
  'queryKey' | 'queryFn'
>;

export const useAppQuery = <TData>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: AppQueryOptions<TData>,
): UseQueryResult<TData, HttpError> => {
  return useQuery<TData, HttpError>({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      if (error.type === 'NOT_FOUND' || error.type === 'VALIDATION') {
        return false;
      }
      return failureCount < 2;
    },
    ...options,
  });
};

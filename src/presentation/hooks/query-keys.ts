import type { TmdbDiscoverParams, TmdbSearchParams } from '@/infrastructure/api/types';

export const movieKeys = {
  all: ['movies'] as const,
  configuration: () => [...movieKeys.all, 'configuration'] as const,
  genres: () => [...movieKeys.all, 'genres'] as const,
  trending: (page = 1) => [...movieKeys.all, 'trending', { page }] as const,
  discover: (filters?: TmdbDiscoverParams) =>
    [...movieKeys.all, 'discover', filters ?? {}] as const,
  search: (params?: TmdbSearchParams) =>
    [...movieKeys.all, 'search', params ?? { query: '' }] as const,
  details: () => [...movieKeys.all, 'detail'] as const,
  detail: (id: number) => [...movieKeys.details(), id] as const,
  recommendations: (id: number, page = 1) =>
    [...movieKeys.detail(id), 'recommendations', { page }] as const,
};

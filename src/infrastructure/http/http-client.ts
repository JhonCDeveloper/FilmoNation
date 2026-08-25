import axios, { type AxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { HttpError, type HttpErrorType } from './http-error';
import type { TmdbErrorPayload } from '../api/types';

function mapToHttpError(error: unknown): HttpError {
  if (error instanceof HttpError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return new HttpError('NETWORK_ERROR', 'Sin conexión a internet o red no disponible');
    }

    const status = error.response.status;
    const data = error.response.data as Partial<TmdbErrorPayload> | undefined;
    const tmdbCode = data?.status_code;
    const message = data?.status_message ?? error.message;

    let type: HttpErrorType = 'UNKNOWN';

    if (status === 404 || tmdbCode === 34) {
      type = 'NOT_FOUND';
    } else if (status === 400 || tmdbCode === 22) {
      type = 'VALIDATION';
    } else if (status === 429) {
      type = 'RATE_LIMIT';
    } else if (status >= 500) {
      type = 'SERVER_ERROR';
    }

    const headers = error.response.headers as Record<string, unknown>;
    const rawRetryAfter = headers['retry-after'];
    const retryHeader = typeof rawRetryAfter === 'string' ? rawRetryAfter : undefined;
    const retryAfter = retryHeader ? parseInt(retryHeader, 10) : undefined;

    return new HttpError(type, message, status, Number.isNaN(retryAfter) ? undefined : retryAfter);
  }

  if (error instanceof Error) {
    return new HttpError('UNKNOWN', error.message);
  }

  return new HttpError('UNKNOWN', 'Ocurrió un error inesperado');
}

const api = axios.create({
  baseURL: env.VITE_TMDB_API_BASE,
  headers: {
    Authorization: `Bearer ${env.VITE_TMDB_READ_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(mapToHttpError(error)),
);

export const httpClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.get<T>(url, config);
    return response.data;
  },
  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },
  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.put<T>(url, data, config);
    return response.data;
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.delete<T>(url, config);
    return response.data;
  },
};

export { api };

import { localStorageService } from './local-storage';

export interface UserPassportData {
  stampedMovieIds: number[]; // Películas vistas (Pasaporte sellado)
  watchlistMovieIds: number[]; // Visas pendientes (Por ver)
  favoriteMovieIds: number[]; // Residencia Permanente (Favoritos)
  moviesMetadata: Record<number, { runtime: number }>; // Metadatos para métricas
  updatedAt: string;
}

const STORAGE_KEYS = {
  PASSPORT: 'filmonation_user_passport_v1',
} as const;

const DEFAULT_PASSPORT: UserPassportData = {
  stampedMovieIds: [],
  watchlistMovieIds: [],
  favoriteMovieIds: [],
  moviesMetadata: {},
  updatedAt: new Date().toISOString(),
};

export const passportStorage = {
  getPassport: (): UserPassportData => {
    const data = localStorageService.get<UserPassportData>(STORAGE_KEYS.PASSPORT, DEFAULT_PASSPORT);
    return {
      ...DEFAULT_PASSPORT,
      ...data,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      favoriteMovieIds: data.favoriteMovieIds ?? [],
    };
  },

  savePassport: (data: UserPassportData): void => {
    localStorageService.set(STORAGE_KEYS.PASSPORT, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  clearPassport: (): void => {
    localStorageService.remove(STORAGE_KEYS.PASSPORT);
  },
};

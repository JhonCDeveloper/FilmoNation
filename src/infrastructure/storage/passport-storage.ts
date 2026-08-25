import { localStorageService } from './local-storage';

export interface UserPassportData {
  stampedMovieIds: number[]; // Películas vistas (Pasaporte sellado)
  watchlistMovieIds: number[]; // Visas pendientes (Por ver)
  updatedAt: string;
}

const STORAGE_KEYS = {
  PASSPORT: 'filmonation_user_passport_v1',
} as const;

const DEFAULT_PASSPORT: UserPassportData = {
  stampedMovieIds: [],
  watchlistMovieIds: [],
  updatedAt: new Date().toISOString(),
};

export const passportStorage = {
  getPassport: (): UserPassportData => {
    return localStorageService.get<UserPassportData>(STORAGE_KEYS.PASSPORT, DEFAULT_PASSPORT);
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

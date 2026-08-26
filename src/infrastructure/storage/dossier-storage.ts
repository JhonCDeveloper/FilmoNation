import { localStorageService } from './local-storage';

export interface Dossier {
  id: string;
  title: string;
  notes: string;
  movieIds: number[];
  createdAt: string;
}

const STORAGE_KEYS = {
  DOSSIERS: 'filmonation_user_dossiers_v1',
} as const;

export const dossierStorage = {
  getDossiers: (): Dossier[] => {
    return localStorageService.get<Dossier[]>(STORAGE_KEYS.DOSSIERS, []);
  },

  saveDossiers: (data: Dossier[]): void => {
    localStorageService.set(STORAGE_KEYS.DOSSIERS, data);
  },

  clearDossiers: (): void => {
    localStorageService.remove(STORAGE_KEYS.DOSSIERS);
  },
};

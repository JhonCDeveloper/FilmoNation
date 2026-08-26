import { createContext } from 'react';
import type { Dossier } from '@/infrastructure/storage/dossier-storage';

export interface DossierContextValue {
  dossiers: Dossier[];
  createDossier: (title: string, notes: string) => Dossier;
  removeDossier: (id: string) => void;
  addMovieToDossier: (dossierId: string, movieId: number) => void;
  removeMovieFromDossier: (dossierId: string, movieId: number) => void;
  getDossiersForMovie: (movieId: number) => Dossier[];
}

export const DossierContext = createContext<DossierContextValue | undefined>(undefined);

import { useState, useCallback, type ReactNode } from 'react';
import { DossierContext } from './dossier-context';
import { dossierStorage, type Dossier } from '@/infrastructure/storage/dossier-storage';

interface DossierProviderProps {
  children: ReactNode;
}

export function DossierProvider({ children }: DossierProviderProps) {
  const [dossiers, setDossiers] = useState<Dossier[]>(() => dossierStorage.getDossiers());

  const createDossier = useCallback((title: string, notes: string) => {
    const newDossier: Dossier = {
      id: crypto.randomUUID(),
      title,
      notes,
      movieIds: [],
      createdAt: new Date().toISOString(),
    };

    setDossiers((prev) => {
      const next = [newDossier, ...prev];
      dossierStorage.saveDossiers(next);
      return next;
    });
    return newDossier;
  }, []);

  const removeDossier = useCallback((id: string) => {
    setDossiers((prev) => {
      const next = prev.filter((dossier) => dossier.id !== id);
      dossierStorage.saveDossiers(next);
      return next;
    });
  }, []);

  const addMovieToDossier = useCallback((dossierId: string, movieId: number) => {
    setDossiers((prev) => {
      const next = prev.map((dossier) => {
        if (dossier.id === dossierId && !dossier.movieIds.includes(movieId)) {
          return { ...dossier, movieIds: [...dossier.movieIds, movieId] };
        }
        return dossier;
      });
      dossierStorage.saveDossiers(next);
      return next;
    });
  }, []);

  const removeMovieFromDossier = useCallback((dossierId: string, movieId: number) => {
    setDossiers((prev) => {
      const next = prev.map((dossier) => {
        if (dossier.id === dossierId && dossier.movieIds.includes(movieId)) {
          return { ...dossier, movieIds: dossier.movieIds.filter((id) => id !== movieId) };
        }
        return dossier;
      });
      dossierStorage.saveDossiers(next);
      return next;
    });
  }, []);

  const getDossiersForMovie = useCallback(
    (movieId: number) => {
      return dossiers.filter((dossier) => dossier.movieIds.includes(movieId));
    },
    [dossiers],
  );

  return (
    <DossierContext.Provider
      value={{
        dossiers,
        createDossier,
        removeDossier,
        addMovieToDossier,
        removeMovieFromDossier,
        getDossiersForMovie,
      }}
    >
      {children}
    </DossierContext.Provider>
  );
}

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { passportStorage, type UserPassportData } from '@/infrastructure/storage/passport-storage';
import { PassportContext } from './passport-context';
import { tmdbApi } from '@/infrastructure/api/tmdb-api';

interface PassportProviderProps {
  children: ReactNode;
}

export function PassportProvider({ children }: PassportProviderProps) {
  const [passport, setPassport] = useState<UserPassportData>(() => passportStorage.getPassport());

  useEffect(() => {
    passportStorage.savePassport(passport);
  }, [passport]);

  // Heal missing metadata for previously stamped movies
  useEffect(() => {
    const missingMetadataIds = passport.stampedMovieIds.filter(
      (id) => !passport.moviesMetadata[id],
    );

    if (missingMetadataIds.length > 0) {
      missingMetadataIds.forEach((id) => {
        tmdbApi
          .getMovieDetails(id)
          .then((details) => {
            if (details.runtime) {
              setPassport((prev) => ({
                ...prev,
                moviesMetadata: {
                  ...prev.moviesMetadata,
                  [id]: { runtime: details.runtime ?? 0 },
                },
              }));
            }
          })
          .catch(console.error);
      });
    }
  }, [passport.stampedMovieIds, passport.moviesMetadata]);

  const toggleStamp = useCallback((movieId: number) => {
    setPassport((prev) => {
      const exists = prev.stampedMovieIds.includes(movieId);
      const stampedMovieIds = exists
        ? prev.stampedMovieIds.filter((id) => id !== movieId)
        : [...prev.stampedMovieIds, movieId];

      const watchlistMovieIds = exists
        ? prev.watchlistMovieIds
        : prev.watchlistMovieIds.filter((id) => id !== movieId);

      const currentMetadata = prev.moviesMetadata;

      if (!exists && !currentMetadata[movieId]) {
        // Obtenemos runtime en background para cálculo de horas
        tmdbApi
          .getMovieDetails(movieId)
          .then((details) => {
            if (details.runtime) {
              setPassport((current) => ({
                ...current,
                moviesMetadata: {
                  ...current.moviesMetadata,
                  [movieId]: { runtime: details.runtime ?? 0 },
                },
              }));
            }
          })
          .catch(console.error);
      }

      return { ...prev, stampedMovieIds, watchlistMovieIds, moviesMetadata: currentMetadata };
    });
  }, []);

  const toggleWatchlist = useCallback((movieId: number) => {
    setPassport((prev) => {
      const exists = prev.watchlistMovieIds.includes(movieId);
      const watchlistMovieIds = exists
        ? prev.watchlistMovieIds.filter((id) => id !== movieId)
        : [...prev.watchlistMovieIds, movieId];

      return { ...prev, watchlistMovieIds };
    });
  }, []);

  const toggleFavorite = useCallback((movieId: number) => {
    setPassport((prev) => {
      const exists = prev.favoriteMovieIds.includes(movieId);
      const favoriteMovieIds = exists
        ? prev.favoriteMovieIds.filter((id) => id !== movieId)
        : [...prev.favoriteMovieIds, movieId];

      return { ...prev, favoriteMovieIds };
    });
  }, []);

  const isStamped = useCallback(
    (movieId: number) => passport.stampedMovieIds.includes(movieId),
    [passport.stampedMovieIds],
  );

  const isWatchlisted = useCallback(
    (movieId: number) => passport.watchlistMovieIds.includes(movieId),
    [passport.watchlistMovieIds],
  );

  const isFavorite = useCallback(
    (movieId: number) => passport.favoriteMovieIds.includes(movieId),
    [passport.favoriteMovieIds],
  );

  return (
    <PassportContext.Provider
      value={{
        passport,
        toggleStamp,
        toggleWatchlist,
        toggleFavorite,
        isStamped,
        isWatchlisted,
        isFavorite,
      }}
    >
      {children}
    </PassportContext.Provider>
  );
}

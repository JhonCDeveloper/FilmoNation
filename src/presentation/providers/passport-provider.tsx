import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { passportStorage, type UserPassportData } from '@/infrastructure/storage/passport-storage';
import { PassportContext } from './passport-context';

interface PassportProviderProps {
  children: ReactNode;
}

export function PassportProvider({ children }: PassportProviderProps) {
  const [passport, setPassport] = useState<UserPassportData>(() => passportStorage.getPassport());

  useEffect(() => {
    passportStorage.savePassport(passport);
  }, [passport]);

  const toggleStamp = useCallback((movieId: number) => {
    setPassport((prev) => {
      const exists = prev.stampedMovieIds.includes(movieId);
      const stampedMovieIds = exists
        ? prev.stampedMovieIds.filter((id) => id !== movieId)
        : [...prev.stampedMovieIds, movieId];

      const watchlistMovieIds = exists
        ? prev.watchlistMovieIds
        : prev.watchlistMovieIds.filter((id) => id !== movieId);

      return { ...prev, stampedMovieIds, watchlistMovieIds };
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

  const isStamped = useCallback(
    (movieId: number) => passport.stampedMovieIds.includes(movieId),
    [passport.stampedMovieIds],
  );

  const isWatchlisted = useCallback(
    (movieId: number) => passport.watchlistMovieIds.includes(movieId),
    [passport.watchlistMovieIds],
  );

  return (
    <PassportContext.Provider
      value={{
        passport,
        toggleStamp,
        toggleWatchlist,
        isStamped,
        isWatchlisted,
      }}
    >
      {children}
    </PassportContext.Provider>
  );
}

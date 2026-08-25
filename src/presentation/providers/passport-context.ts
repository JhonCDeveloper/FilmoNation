import { createContext } from 'react';
import type { UserPassportData } from '@/infrastructure/storage/passport-storage';

export interface PassportContextType {
  passport: UserPassportData;
  toggleStamp: (movieId: number) => void;
  toggleWatchlist: (movieId: number) => void;
  isStamped: (movieId: number) => boolean;
  isWatchlisted: (movieId: number) => boolean;
}

export const PassportContext = createContext<PassportContextType | null>(null);

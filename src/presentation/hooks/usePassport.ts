import { useContext } from 'react';
import { PassportContext, type PassportContextType } from '../providers/passport-context';

export const usePassport = (): PassportContextType => {
  const context = useContext(PassportContext);
  if (!context) {
    throw new Error('usePassport debe usarse dentro de un PassportProvider');
  }
  return context;
};

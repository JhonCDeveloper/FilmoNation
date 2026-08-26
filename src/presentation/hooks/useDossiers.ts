import { useContext } from 'react';
import { DossierContext } from '../providers/dossier-context';

export function useDossiers() {
  const context = useContext(DossierContext);
  if (context === undefined) {
    throw new Error('useDossiers debe usarse dentro de un DossierProvider');
  }
  return context;
}

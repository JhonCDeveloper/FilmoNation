import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { queryClient } from '../lib/query-client';
import { PassportProvider } from './passport-provider';
import { DossierProvider } from './dossier-provider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <DossierProvider>
        <PassportProvider>{children}</PassportProvider>
      </DossierProvider>
    </QueryClientProvider>
  );
}

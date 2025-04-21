import React from 'react';
import { AuthProvider } from './AuthProvider';
import { NotesProvider } from './NotesProvider';
import { SummaryProvider } from './SummaryProvider';
import { ActionsProvider } from './ActionsContext';
import { ThemeProvider } from './ThemeContext';
export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ActionsProvider>
          <NotesProvider>
          <SummaryProvider>
            {children}
          </SummaryProvider>
          </NotesProvider>
        </ActionsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

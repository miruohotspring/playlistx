'use client';
import { NotificationProvider } from '@components/ui';
import { ScProvider } from './ScProvider';
import { LanguageProvider } from './LanguageProvider';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { SessionProvider } from './SessionProvider';
import React, { type ReactNode } from 'react';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fff',
    },
  },
});

export const AppProviders = ({
  children,
  lang,
}: { children: ReactNode; lang: string }) => {
  return (
    <ThemeProvider theme={theme}>
      <SessionProvider>
        <ScProvider>
          <CssBaseline />
          <NotificationProvider>
            <LanguageProvider initialLanguage={lang}>
              {children}
            </LanguageProvider>
          </NotificationProvider>
        </ScProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};

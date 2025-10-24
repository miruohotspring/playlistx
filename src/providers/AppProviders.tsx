'use client';
import { NotificationProvider } from '@components/ui';
import { LanguageProvider } from '@i18n/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import React, { type ReactNode } from 'react';
import { ScProvider } from '../app/_features/Providers/ScProvider';

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

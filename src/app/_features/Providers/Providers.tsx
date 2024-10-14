'use client';

import { LanguageProvider } from '@i18n/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';
import { ScProvider } from './ScProvider';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fff',
    },
  },
});

type ProvidersProps = {
  children: ReactNode;
  lang: string;
};

export const Providers = ({ children, lang }: ProvidersProps) => {
  return (
    <ThemeProvider theme={theme}>
      <SessionProvider>
        <ScProvider>
          <CssBaseline />
          <LanguageProvider initialLanguage={lang}>{children}</LanguageProvider>
        </ScProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};

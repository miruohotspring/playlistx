'use client';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fff',
    },
  },
});

type ThemeRegistryProps = {
  children: ReactNode;
};

export const ThemeRegistry = ({ children }: ThemeRegistryProps) => {
  return (
    <ThemeProvider theme={theme}>
      <SessionProvider>
        <CssBaseline />
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
};

'use client';

import {
  Container,
  type ContainerProps,
  Paper,
  type PaperProps,
} from '@mui/material';
import type React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: ContainerProps['maxWidth'];
  containerSx?: ContainerProps['sx'];
  paperSx?: PaperProps['sx'];
  disablePaper?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'md',
  containerSx,
  paperSx,
  disablePaper = false,
}) => {
  const content = disablePaper ? (
    children
  ) : (
    <Paper sx={{ p: 3, ...paperSx }}>{children}</Paper>
  );

  return (
    <Container maxWidth={maxWidth} sx={{ mt: 4, ...containerSx }}>
      {content}
    </Container>
  );
};

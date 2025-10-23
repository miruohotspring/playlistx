'use client';

import { Button, type ButtonProps, CircularProgress } from '@mui/material';
import type React from 'react';

interface LoadingButtonProps
  extends Omit<ButtonProps, 'startIcon' | 'endIcon'> {
  loading?: boolean;
  loadingPosition?: 'start' | 'end' | 'center';
  loadingIndicator?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingPosition = 'center',
  loadingIndicator,
  startIcon,
  endIcon,
  disabled,
  children,
  ...buttonProps
}) => {
  const defaultLoadingIndicator = (
    <CircularProgress size={16} color="inherit" />
  );

  const loadingIcon = loadingIndicator || defaultLoadingIndicator;

  const getStartIcon = () => {
    if (loading && loadingPosition === 'start') {
      return loadingIcon;
    }
    return startIcon;
  };

  const getEndIcon = () => {
    if (loading && loadingPosition === 'end') {
      return loadingIcon;
    }
    return endIcon;
  };

  const getChildren = () => {
    if (loading && loadingPosition === 'center') {
      return loadingIcon;
    }
    return children;
  };

  return (
    <Button
      {...buttonProps}
      disabled={disabled || loading}
      startIcon={getStartIcon()}
      endIcon={getEndIcon()}
    >
      {getChildren()}
    </Button>
  );
};

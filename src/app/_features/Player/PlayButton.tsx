import { Pause, PlayArrow } from '@mui/icons-material';
import { Button as B } from '@mui/material';
import type { MouseEventHandler } from 'react';
import React from 'react';

type PlayButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  isPlaying: boolean;
};

export const PlayButton = ({ onClick, isPlaying }: PlayButtonProps) => {
  return (
    <B
      variant="contained"
      onClick={onClick}
      style={{
        borderRadius: '50%',
        width: '56px',
        height: '56px',
        minWidth: '56px',
      }}
    >
      {isPlaying ? <Pause /> : <PlayArrow />}
    </B>
  );
};

import { Slider as S } from '@mui/material';
import type { SyntheticEvent } from 'react';
import React from 'react';

type SliderProps = {
  duration: number;
  currentTime: number;
  onChange:
    | ((event: Event, value: number | number[], activeThumb: number) => void)
    | undefined;
  onChangeCommitted:
    | ((
        event: Event | SyntheticEvent<Element, Event>,
        value: number | number[],
      ) => void)
    | undefined;
};

export const Slider = ({
  duration,
  currentTime,
  onChange,
  onChangeCommitted,
}: SliderProps) => {
  return (
    <S
      value={currentTime}
      max={duration}
      onChange={onChange}
      onChangeCommitted={onChangeCommitted}
      aria-labelledby="seek-slider"
      sx={{ width: '50%', marginTop: '10px' }}
    />
  );
};

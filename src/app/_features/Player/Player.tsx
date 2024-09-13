'use client';

import { PlayButton, Slider } from './';
import { getSignedStreamUrl } from '@serverActions/getSignedStreamUrl';
import { type SyntheticEvent, useEffect, useRef, useState } from 'react';

type PlayerProps = {
  videoId: string | null;
  playing: boolean;
};

export const Player = ({ videoId, playing }: PlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // biome-ignore lint/suspicious/noExplicitAny: -_-
  const [player, setPlayer] = useState<any>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(playing);

  useEffect(() => {
    const loadDashJS = async () => {
      if (typeof window !== 'undefined') {
        const Dash = await import('@public/dashjs/dash.all.min.js');
        if (Dash && window.dashjs && videoRef.current) {
          const dashPlayer = window.dashjs.MediaPlayer().create();
          if (!videoId) {
            dashPlayer.initialize(videoRef.current, '', false);
          } else {
            const res = await getSignedStreamUrl(videoId);
            dashPlayer.initialize(
              videoRef.current,
              res.success ? res.data : '',
              false,
            );
          }
          dashPlayer.on(
            window.dashjs.MediaPlayer.events.STREAM_INITIALIZED,
            () => {
              setDuration(dashPlayer.duration());
            },
          );

          dashPlayer.on(
            window.dashjs.MediaPlayer.events.PLAYBACK_TIME_UPDATED,
            () => {
              setCurrentTime(dashPlayer.time());
            },
          );

          setPlayer(dashPlayer);
        }
      }
    };

    loadDashJS();

    if (player) {
      if (playing) {
        player.play();
      } else {
        player.pause();
      }
    }
  }, [playing, videoId]);

  const handlePlayPause = () => {
    if (player) {
      if (player.isPaused()) {
        player.play();
        setIsPlaying(true);
      } else {
        player.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (_event: Event, newValue: number | number[]) => {
    setCurrentTime(newValue as number);
  };

  const handleSeekCommitted = (
    _event: Event | SyntheticEvent,
    newValue: number | number[],
  ) => {
    if (player) {
      player.seek(newValue as number);
    }
  };

  return (
    <div>
      {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
      <video ref={videoRef} style={{ display: 'none' }} />
      <div
        style={{
          position: 'fixed',
          width: '100%',
          bottom: '0px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '10px',
          paddingBottom: '10px',
        }}
      >
        <PlayButton onClick={handlePlayPause} isPlaying={isPlaying} />
        <Slider
          currentTime={currentTime}
          duration={duration}
          onChange={handleSeek}
          onChangeCommitted={handleSeekCommitted}
        />
      </div>
    </div>
  );
};

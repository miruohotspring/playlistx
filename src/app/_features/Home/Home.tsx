'use client';

import logger from '@common/logger';
import { Player } from '@features/Player';
import { Playlist } from '@features/Playlist';
import { useState } from 'react';

const Home = () => {
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handlePlayPause = (trackId: string | null) => {
    if (trackId === null) {
      setIsPlaying(false);
      setCurrentTrackId(null);
    } else if (currentTrackId === trackId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrackId(trackId);
      setIsPlaying(true);
    }
  };

  logger.info(isPlaying);

  return (
    <>
      <Playlist onPlayPause={handlePlayPause} />
      <Player videoId={currentTrackId} playing={isPlaying} />
    </>
  );
};

export default Home;

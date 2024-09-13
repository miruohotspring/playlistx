import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell as TC,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  IconButton,
  styled,
  useTheme,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { Audiotrack } from '@mui/icons-material';

type Track = {
  index: 1;
  id: string;
  title: string;
  album: string;
  duration: string;
  artist: string;
};

const tracks: Track[] = [
  {
    index: 1,
    id: 'b29f646d6c3139918415f2f3473aeb44',
    title: '慣情',
    album: 'goodloop',
    duration: '2:50',
    artist: 'miruo',
  },
];

const TableCell = styled(TC)({
  paddingTop: 0,
  paddingBottom: 0,
});

type PlaylistProps = {
  onPlayPause: (id: string | null) => void;
};

export const Playlist = ({ onPlayPause }: PlaylistProps) => {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const theme = useTheme();

  const handlePlayPause = (id: string) => {
    if (isPlaying === id) {
      setIsPlaying(null);
      setSelectedRow(null);
      onPlayPause(null);
    } else {
      setIsPlaying(id);
      setSelectedRow(id);
      onPlayPause(id);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TC> </TC>
            <TC>#</TC>
            <TC>Title</TC>
            <TC>Album</TC>
            <TC>Duration</TC>
          </TableRow>
        </TableHead>
        <TableBody>
          {tracks.map((track) => (
            <TableRow
              key={track.id}
              hover
              selected={selectedRow === track.id}
              onClick={() => setSelectedRow(track.id)}
              style={{
                cursor: 'pointer',
                backgroundColor:
                  selectedRow === track.id
                    ? theme.palette.action.hover
                    : 'inherit',
              }}
            >
              <TableCell width="48px">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPause(track.id);
                  }}
                >
                  {isPlaying === track.id ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
              </TableCell>
              <TableCell width="48px">{track.index}</TableCell>
              <TableCell>
                <ListItem
                  disableGutters
                  style={{ paddingTop: 0, paddingBottom: 0 }}
                >
                  <ListItemAvatar>
                    <Avatar variant="rounded" style={{ borderRadius: '8px' }}>
                      <Audiotrack />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={track.title}
                    secondary={track.artist}
                  />
                </ListItem>
              </TableCell>
              <TableCell>{track.album}</TableCell>
              <TableCell>{track.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

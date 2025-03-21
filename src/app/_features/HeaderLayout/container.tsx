'use client';

import logger from '@common/logger';
import { type Playlist, fetchUserPlaylists } from '@features/Playlists';
import AddPlaylistDialog from '@features/Playlists/containers/AddPlaylistDialog';
import { useLanguage, useTranslation } from '@i18n/client';
import { Settings } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { SidebarItem } from './Sidebar';
import HeaderLayoutUI from './presentational';

const HeaderLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const [show, setShow] = useState(true);
  const [open, setOpen] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(true);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [addPlaylistDialogOpen, setAddPlaylistDialogOpen] = useState(false);

  const handleClick = () => {
    setShow(!show);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setPlaylists(await fetchUserPlaylists());
      } catch (error) {
        logger.error('Error fething playlists', error);
      }
    };
    fetchPlaylists();
  }, []);

  const playlistItems: SidebarItem[] = playlists.map((playlist) => ({
    label: playlist.name,
    onClick: () => router.push(`/playlist/${playlist.id}`),
    icon: <FormatListBulletedIcon />,
  }));

  const items: SidebarItem[][] = [
    [
      {
        label: t('common:home'),
        icon: <HomeIcon />,
        onClick: () => router.push('/'),
      },
      {
        label: t('common:settings'),
        icon: <Settings />,
        onClick: () => router.push('/settings'),
      },
    ],
    [
      {
        label: t('common:playlists'),
        icon: <FormatListBulletedIcon />,
        onClick: () => setPlaylistOpen(!playlistOpen),
        open: playlistOpen,
        items: [
          {
            label: t('common:new'),
            onClick: () => setAddPlaylistDialogOpen(true),
            icon: <AddIcon />,
          },
          ...playlistItems,
        ],
      },
    ],
  ];

  return (
    <HeaderLayoutUI
      items={items}
      show={show}
      open={open}
      handleClick={handleClick}
      handleOpen={handleOpen}
      handleClose={handleClose}
    >
      <AddPlaylistDialog
        open={addPlaylistDialogOpen}
        onClose={async () => {
          setAddPlaylistDialogOpen(false);
          setPlaylists(await fetchUserPlaylists());
        }}
      />
      {children}
    </HeaderLayoutUI>
  );
};

export default HeaderLayout;

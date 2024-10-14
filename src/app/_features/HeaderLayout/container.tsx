'use client';

import { useLanguage, useTranslation } from '@i18n/client';
import { Settings } from '@mui/icons-material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { SidebarItem } from './Sidebar';
import HeaderLayoutUI from './presentational';

const HeaderLayout = ({ children }: { children: React.ReactNode }) => {
  const [show, setShow] = useState(true);
  const [open, setOpen] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);

  const router = useRouter();
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const handleClick = () => {
    setShow(!show);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
        items: [],
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
      {children}
    </HeaderLayoutUI>
  );
};

export default HeaderLayout;

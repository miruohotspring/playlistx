import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar, type SidebarItem } from './Sidebar';

interface HeaderLayoutUIProps {
  items: SidebarItem[][];
  show: boolean;
  open: boolean;
  handleClick: () => void;
  handleOpen: () => void;
  handleClose: () => void;
}

const HeaderLayoutUI = ({
  children,
  items,
  show,
  open,
  handleClick,
  handleOpen,
  handleClose,
}: { children: ReactNode } & HeaderLayoutUIProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      <Header handleSidebarOpen={handleClick} />
      <Sidebar
        items={items}
        show={show}
        open={open || !isSmallScreen}
        handleOpen={handleOpen}
        handleClose={handleClose}
        width={drawerWidth}
      />
      <Box
        sx={{
          flexGrow: 1,
          transition: 'margin 0.3s',
          marginLeft: show
            ? !isSmallScreen
              ? `${drawerWidth}px`
              : theme.spacing(7)
            : 0,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default HeaderLayoutUI;

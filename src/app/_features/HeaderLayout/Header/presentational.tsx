import {
  AppBar,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Search } from '@mui/icons-material';
import type { KeyboardEventHandler } from 'react';

const Header = ({
  handleSidebarOpen,
  onKeyDown,
}: {
  handleSidebarOpen: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}) => {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={handleSidebarOpen}
        >
          <MenuIcon />
        </IconButton>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          <TextField
            fullWidth
            id="search"
            size="small"
            slotProps={{
              input: {
                sx: {
                  borderRadius: '24px',
                },
                onKeyDown: onKeyDown,
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ maxWidth: '480px' }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

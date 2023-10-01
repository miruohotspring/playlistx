import { IconButton, AppBar, Box, Toolbar, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'
import { Drawer } from "@mui/material"
import { useState } from 'react'
import PxDrawerList from "./PxDrawerList"


const PxAppBar: React.FC = () => {
  const [state, setState] = useState({
    isDrawerOpen: false
  })

  const PxDrawer = () => {
    return (
      <Drawer
        anchor='left'
        open={state.isDrawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{width: 250}}
        >
          <PxDrawerList />
        </Box>
      </Drawer>
    )
  }

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
       (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, isDrawerOpen: open })
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
    <PxDrawer />
    <AppBar position='static'>
      <Toolbar>
        <IconButton
          onClick={toggleDrawer(true)}
          size='large'
          edge='start'
          color='inherit'
          aria-label='menu'
          sx={{ mr:2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component='div' sx={{ flexGrow:1 }}>
          PlaylistX
        </Typography>
      </Toolbar>
    </AppBar>
    </Box>
  )
}

export default PxAppBar

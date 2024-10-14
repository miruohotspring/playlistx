import type { ReactNode } from 'react';
import { Box, Collapse, Drawer } from '@mui/material';
import {
  type CSSObject,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  type Theme,
  Toolbar,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

export interface SidebarItem {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  items?: SidebarItem[];
  open?: boolean;
}

const ListGroup = ({
  items,
  open,
}: { items: SidebarItem[]; open: boolean }) => {
  return (
    <>
      {items.map((item, index) => (
        <Box key={index}>
          {item.items !== undefined ? (
            <>
              <ListItemButton
                onClick={item.onClick}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: 'initial',
                      }
                    : {
                        justifyContent: 'center',
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: 'auto',
                        },
                  ]}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={[
                    {
                      whiteSpace: 'nowrap',
                    },
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
                {open ? item.open ? <ExpandLess /> : <ExpandMore /> : <></>}
              </ListItemButton>
              <Collapse in={item.open} timeout="auto">
                <List disablePadding>
                  <ListGroup items={item.items} open={open} />
                </List>
              </Collapse>
            </>
          ) : (
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={item.onClick}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: 'initial',
                      }
                    : {
                        justifyContent: 'center',
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: 'auto',
                        },
                  ]}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={[
                    {
                      whiteSpace: 'nowrap',
                    },
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          )}
        </Box>
      ))}
    </>
  );
};

interface SidebarProps {
  items?: SidebarItem[][];
  show?: boolean;
  open?: boolean;
  handleOpen?: () => void;
  handleClose?: () => void;
  width?: number;
}

const Sidebar = ({
  items,
  show = false,
  open = false,
  handleOpen,
  handleClose,
  width = 240,
}: SidebarProps) => {
  const openedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    width: show ? width : 0,
  });

  const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: show ? `calc(${theme.spacing(7)} + 1px)` : 0,
    [theme.breakpoints.up('sm')]: {
      width: show ? `calc(${theme.spacing(8)} + 1px)` : 0,
    },
  });

  return (
    <>
      <Drawer
        variant="permanent"
        open={open}
        sx={(theme) => ({
          position: 'fixed',
          flexGrow: 1,
          zIndex: theme.zIndex.drawer,
          '& .MuiDrawer-paper': open ? openedMixin(theme) : closedMixin(theme),
        })}
        onMouseOver={handleOpen}
        onMouseLeave={handleClose}
      >
        <Toolbar />
        {items?.map((block, index) => (
          <Box key={index}>
            <Divider />
            <List>
              <ListGroup items={block} open={open} />
            </List>
          </Box>
        ))}
      </Drawer>
    </>
  );
};

export default Sidebar;

import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { FaBars, FaClipboardList, FaUser } from 'react-icons/fa';
import { Link, Outlet } from 'react-router';

const drawerWidth = 240;

const menuItems = [
  {
    icon: <FaClipboardList />,
    text: 'Заявки',
    link: '/applications',
  },
  {
    icon: <FaUser />,
    text: 'Мои заявки',
    link: '/my-applications',
  },
];

export const MainLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2 }}
          >
            <FaBars />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Логотип
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Лев
            </Typography>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'white',
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: isOpen ? drawerWidth : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isOpen ? drawerWidth : 0,
            boxSizing: 'border-box',
            transition: 'width 0.3s ease',
          },
        }}
        variant="persistent"
        anchor="left"
        open={isOpen}
      >
        <Toolbar />
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              button
              component={Link}
              to={item.link}
              key={index}
              sx={{ userSelect: 'none' }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

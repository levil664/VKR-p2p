import {
  AppBar,
  Avatar,
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
import { FaBars, FaBook } from 'react-icons/fa';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { useAppSelector } from '../../../app/api';
import { useMeQuery } from '../../../entities/user/api/userApi';
import { drawerWidth, menuItems } from '../lib/const';

export const MainLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { data: user } = useMeQuery();
  const userRole = useAppSelector(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName[0] : '';
    const lastInitial = lastName ? lastName[0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={toggleDrawer}
              edge="start"
              sx={{ mr: 2 }}
            >
              <FaBars />
            </IconButton>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
              onClick={handleLogoClick}
            >
              <FaBook style={{ marginRight: '10px' }} />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ userSelect: 'none', color: 'white' }}
              >
                PEERFECT
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{ display: 'flex', alignItems: 'center' }}
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }}
          >
            <Typography variant="body1" sx={{ mr: 2, color: 'white' }}>
              {user?.data?.firstName || 'Loading...'}
            </Typography>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'white',
                color: 'primary.main',
                fontSize: '1rem',
              }}
            >
              {getInitials(user?.data?.firstName, user?.data?.lastName)}
            </Avatar>
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
              sx={{
                userSelect: 'none',
                padding: '8px 16px',
              }}
              selected={location.pathname === item.link}
            >
              <ListItemIcon
                sx={{
                  minWidth: '32px',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: 'black',
                }}
              />
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

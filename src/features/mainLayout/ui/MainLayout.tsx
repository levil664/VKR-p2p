import {
  AppBar,
  Avatar,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FaBook, FaSignOutAlt } from 'react-icons/fa';
import { MdClose, MdMenu, MdRateReview } from 'react-icons/md';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../app/api';
import { authApi, useLogoutMutation } from '../../../entities/auth/api/authApi';
import {
  resetUserState,
  setIsMentor,
  setUserId,
  setUserRole,
} from '../../../entities/user/api/slice';
import { useMeQuery, userApi } from '../../../entities/user/api/userApi';
import { RoleEnum } from '../../../entities/user/model/enums';
import { drawerWidth, menuItems } from '../lib/const';
import { useGetAdvertsWithoutReviewQuery } from '../../../entities/review/api/reviewApi';
import { CreateReviewModal } from '../../createReviewModal/ui/CreateReviewModal';

export const MainLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAdvertId, setSelectedAdvertId] = useState<string | null>(null);
  const { data: user } = useMeQuery();
  const { data: advertsWithoutReview } = useGetAdvertsWithoutReviewQuery();
  const dispatch = useAppDispatch();
  const userRole = useAppSelector(state => state.user.role);
  const navigate = useNavigate();
  const location = useLocation();
  const [logout] = useLogoutMutation();
  const isMobile = useMediaQuery('(max-width:600px)');

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenReviewModal = (advertId: string) => {
    setSelectedAdvertId(advertId);
    handleMenuClose();
  };

  const handleCloseReviewModal = () => {
    setSelectedAdvertId(null);
  };

  useEffect(() => {
    if (user?.data) {
      dispatch(setUserRole(user.data.role as RoleEnum));
      dispatch(setIsMentor(user.data.isMentor));
      dispatch(setUserId(user.data.id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    await logout({});
    dispatch(authApi.util.resetApiState());
    dispatch(userApi.util.resetApiState());
    dispatch(resetUserState());
    navigate('/login');
  };

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName[0] : '';
    const lastInitial = lastName ? lastName[0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.allowedRoles.includes(userRole as RoleEnum)
  );

  const handleNavigationChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    navigate(filteredMenuItems[newValue].link);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isMobile && (
              <IconButton
                color="inherit"
                aria-label="toggle drawer"
                onClick={toggleDrawer}
                edge="start"
                sx={{ mr: 2 }}
              >
                {isOpen ? <MdClose /> : <MdMenu />}
              </IconButton>
            )}
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

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <Badge badgeContent={advertsWithoutReview?.data?.length || 0} color="error">
                <MdRateReview size={24} />
              </Badge>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{ style: { maxHeight: 400, width: '340px', padding: '8px 0' } }}
            >
              <Box sx={{ px: 2, pb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Неоценённые заявки
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Пожалуйста, оставьте отзыв пользователям, с которыми вы взаимодействовали. Это
                  важно для их дальнейшего развития.
                </Typography>
              </Box>

              {advertsWithoutReview?.data?.length ? (
                advertsWithoutReview.data.map(advert => (
                  <MenuItem
                    key={advert.id}
                    onClick={() => handleOpenReviewModal(advert.id)}
                    sx={{
                      whiteSpace: 'normal',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      borderTop: '1px solid #eee',
                      py: 1.2,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: '600', fontSize: '1.05rem', mb: 0.5 }}
                    >
                      {advert.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Пользователь:{' '}
                      <Box component="span" sx={{ fontWeight: '600', color: 'text.primary' }}>
                        {advert.creator.lastName} {advert.creator.firstName}{' '}
                        {advert.creator.middleName}
                      </Box>
                    </Typography>
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  <Typography variant="body2">Нет объявлений без отзыва</Typography>
                </MenuItem>
              )}
            </Menu>

            <CreateReviewModal
              open={!!selectedAdvertId}
              advertId={selectedAdvertId}
              onClose={handleCloseReviewModal}
            />

            <Box
              sx={{ display: 'flex', alignItems: 'center' }}
              onClick={handleProfileClick}
              style={{ cursor: 'pointer' }}
            >
              <Typography variant="body1" sx={{ ml: 2, mr: 2, color: 'white' }}>
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
                {getInitials(user?.data?.lastName, user?.data?.firstName)}
              </Avatar>
            </Box>
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
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        variant="persistent"
        anchor="left"
        open={isOpen}
      >
        <Toolbar />
        <List>
          {filteredMenuItems.map((item, index) => (
            <ListItem
              button
              component={Link}
              to={item.link}
              key={index}
              sx={{
                userSelect: 'none',
                padding: '8px 16px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                },
              }}
              selected={location.pathname === item.link}
            >
              <ListItemIcon sx={{ minWidth: '40px' }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 'bold',
                      color: location.pathname === item.link ? 'primary.main' : 'text.primary',
                    }}
                  >
                    {item.text}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
        <Box
          sx={{
            mt: 'auto',
            textAlign: 'center',
            backgroundColor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <List>
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                userSelect: 'none',
              }}
            >
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <FaSignOutAlt style={{ fontSize: '20px' }} />
              </ListItemIcon>
              <ListItemText primary="Выйти" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: isMobile ? '56px' : '0',
        }}
      >
        <Toolbar />
        <Outlet />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          draggable
          pauseOnHover
          style={{
            top: 74,
            right: '0.5%',
            zIndex: 1000,
          }}
        />
        {isMobile && (
          <BottomNavigation
            value={activeTab}
            onChange={handleNavigationChange}
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            {filteredMenuItems.map((item, index) => (
              <BottomNavigationAction key={index} icon={item.icon} />
            ))}
          </BottomNavigation>
        )}
      </Box>
    </Box>
  );
};

import { Box, Button, Typography } from '@mui/material';
import Lottie from 'lottie-react';
import React from 'react';
import { useNavigate } from 'react-router';
import { useMeQuery } from '../../../entities/user/api/userApi';
import animationData from './404-animation.json';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useMeQuery();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Lottie
        animationData={animationData}
        loop={true}
        style={{ width: '300px', height: '300px' }}
      />
      <Typography variant="h4" align="center" sx={{ mt: 2, mb: 2 }}>
        Ой! Кажется, вы заблудились...
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 3 }}>
        Страница, которую вы ищете, исчезла в параллельной вселенной.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
        sx={{ textTransform: 'none', fontWeight: 'bold' }}
      >
        Вернуться на главную
      </Button>
    </Box>
  );
};

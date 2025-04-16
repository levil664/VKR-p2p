import { Box, Typography } from '@mui/material';
import React from 'react';
import Lottie from 'lottie-react';
import noData from './noData.json';

interface NoDataProps {
  title?: string;
  description?: string;
}

export const NoData: React.FC<NoDataProps> = ({
  title = 'Нет данных',
  description = 'Попробуйте изменить фильтры или текст поиска.',
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Lottie animationData={noData} loop={true} style={{ width: '300px', height: '300px' }} />
    <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
      {title}
    </Typography>
    <Typography variant="body1" sx={{ mb: 3 }}>
      {description}
    </Typography>
  </Box>
);

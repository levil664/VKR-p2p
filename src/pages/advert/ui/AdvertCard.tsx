import { Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import { Advert } from '../../../entities/advert/model';

interface AdvertCardProps {
  advert: Advert;
}

export const AdvertCard: React.FC<AdvertCardProps> = ({ advert }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {advert.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {advert.description}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Статус: {advert.status}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        Дата: {advert.createdOn}
      </Typography>
    </CardContent>
  </Card>
);

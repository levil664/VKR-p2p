import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { AdvertStatus } from '../../../entities/advert/model/enums';

export const AdvertCard = ({ advert }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/adverts/${advert.id}`);
  };

  return (
    <Card
      sx={{
        marginBottom: 2,
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 4,
          cursor: 'pointer',
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent>
        <Typography variant="h5" noWrap sx={{ fontWeight: 'bold', fontSize: '1.5rem', mb: 1 }}>
          {advert.title}
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
          Автор: {advert.student.firstName} {advert.student.lastName}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 1 }}>
          {advert.description}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
          <strong>Статус:</strong> {AdvertStatus[advert.status]?.label || advert.status}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
          <strong>Создано:</strong> {new Date(advert.createdOn).toLocaleDateString()}
        </Typography>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleCardClick}>
            Подробнее
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

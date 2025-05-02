import { Box, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { AdvertStatus } from '../../../entities/advert/model/enums';

export const AdvertResponseCard = ({ response }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/my-response/${response.advert.id}`);
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
        <Typography variant="h5" noWrap sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          {response.advert.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 2 }}>
          {response.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Статус:</strong>{' '}
              {AdvertStatus[response.advert.status]?.label || response.advert.status}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Создано:</strong> {new Date(response.createdOn).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

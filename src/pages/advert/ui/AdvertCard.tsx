import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { AdvertStatus } from '../../../entities/advert/model/enums';

export const AdvertCard = ({ advert }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/advert/${advert.id}`);
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" noWrap sx={{ fontWeight: 'bold', fontSize: '1.5rem', flex: 1 }}>
            {advert.title}
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', ml: 2, flexShrink: 0 }}>
            Автор:{' '}
            {advert.student
              ? `${advert.student.firstName} ${advert.student.lastName}`
              : `${advert.mentor.firstName} ${advert.mentor.lastName}`}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 4 }}>
          {advert.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Статус:</strong> {AdvertStatus[advert.status]?.label || advert.status}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Создано:</strong> {new Date(advert.createdOn).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Тип:</strong> {advert.student ? 'Студент' : 'Наставник'}
            </Typography>
          </Box>
          <Button variant="contained" color="primary" onClick={handleCardClick}>
            Подробнее
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

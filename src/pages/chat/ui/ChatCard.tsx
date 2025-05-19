import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAppSelector } from '../../../app/api';

export const ChatCard = ({ chat }) => {
  const navigate = useNavigate();
  const currentUserId = useAppSelector(state => state.user.id);

  const handleCardClick = () => {
    navigate(`/chat/${chat.id}`);
  };

  const handleAdvertClick = e => {
    e.stopPropagation();
    navigate(`/advert/${chat.advertId}`);
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
        <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 2 }}>
          Участники:{' '}
          {chat.participants
            .filter(p => p.id !== currentUserId)
            .map(p => `${p.lastName} ${p.firstName} ${p.middleName}`)
            .join(', ')}
        </Typography>

        <Box>
          <Button variant="outlined" size="small" onClick={handleAdvertClick}>
            Заявка
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

import { Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

export const ChatCard = ({ chat }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/chat/${chat.id}`);
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
          {chat.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 4 }}>
          Участники: {chat.participants.map(p => p.firstName).join(', ')}
        </Typography>
      </CardContent>
    </Card>
  );
};

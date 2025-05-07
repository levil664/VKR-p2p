import { Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

export const GroupMeetingCard = ({ meeting }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/group-meeting/${meeting.id}`);
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
          {meeting.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 1 }}>
          {meeting.description}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Дата: {new Date(meeting.startDt).toLocaleString()} -{' '}
          {new Date(meeting.endDt).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

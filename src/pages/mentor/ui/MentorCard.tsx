import { Box, Card, CardContent, Typography } from '@mui/material';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router';

export const MentorCard = ({ mentor }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/mentor/${mentor.id}`);
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
          {`${mentor.lastName} ${mentor.firstName} ${mentor.middleName}`}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {mentor.description && `О себе: ${mentor.description || 'Нет описания'}`}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography variant="body1" sx={{ mr: 1 }}>
            Рейтинг:
          </Typography>
          {Array.from({ length: 5 }, (_, index) => (
            <FaStar
              key={index}
              color={index < (mentor.rating || 0) ? 'gold' : 'lightgray'}
              style={{ marginLeft: 2 }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

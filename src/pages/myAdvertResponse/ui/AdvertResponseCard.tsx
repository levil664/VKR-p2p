import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { theme } from '../../../app/theme';
import { AdvertStatus } from '../../../entities/advert/model/enums';
import { useDeleteAdvertResponseMutation } from '../../../entities/advertResponse/api/advertResponseApi';

export const AdvertResponseCard = ({ response }) => {
  const navigate = useNavigate();
  const [deleteAdvertResponse] = useDeleteAdvertResponseMutation();

  const handleCardClick = () => {
    navigate(`/advert/${response.advert.id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteAdvertResponse({
        advertId: response.advert.id,
        responseId: response.id,
      }).unwrap();
      toast.success('Отклик удален!');
    } catch (error) {
      toast.error(error.data.message);
    }
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 1,
          }}
        >
          <Typography variant="h5" noWrap sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
            {response.advert.title}
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Автор:</strong>{' '}
              {response.advert.student
                ? `${response.advert.student.firstName} ${response.advert.student.lastName}`
                : 'Не указан'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Роль:</strong> {response.advert.student?.isMentor ? 'Наставник' : 'Студент'}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 2 }}>
          {response.advert.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Статус:</strong>{' '}
              {AdvertStatus[response.advert.status]?.label || response.advert.status}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Создано:</strong> {new Date(response.advert.createdOn).toLocaleDateString()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={e => {
                e.stopPropagation();
                navigate(`/chat/${response?.response.chatId}`);
              }}
              sx={{
                borderColor: theme.palette.info.main,
                color: theme.palette.info.main,
                '&:hover': {
                  backgroundColor: theme.palette.info.light,
                  borderColor: theme.palette.info.dark,
                  color: '#fff',
                },
              }}
            >
              Чат
            </Button>

            <Button
              variant="outlined"
              onClick={e => {
                e.stopPropagation();
                handleDelete();
              }}
              sx={{
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                '&:hover': {
                  backgroundColor: theme.palette.error.light,
                  borderColor: theme.palette.error.dark,
                  color: '#fff',
                },
              }}
            >
              Удалить
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

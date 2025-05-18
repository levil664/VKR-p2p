import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { FaStar } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useApplyForMentorMutation } from '../../../entities/mentorApplication/api/mentorApplicationApi';
import { useEditProfileMutation, useMeQuery } from '../../../entities/user/api/userApi';
import { useGetReviewsForUserQuery } from '../../../entities/review/api/reviewApi';
import { MentorApplyModal } from './MentorApplyModal';

export const Profile = () => {
  const { data: userResponse, error, isLoading } = useMeQuery();
  const [applyForMentor] = useApplyForMentorMutation();
  const [editProfile] = useEditProfileMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const { data: mentorReviewsResponse, isLoading: isMentorReviewsLoading } =
    useGetReviewsForUserQuery({
      userId: userResponse?.data.id,
      type: 'MENTOR',
    });

  const { data: studentReviewsResponse, isLoading: isStudentReviewsLoading } =
    useGetReviewsForUserQuery({
      userId: userResponse?.data.id,
      type: 'STUDENT',
    });

  useEffect(() => {
    if (userResponse) {
      setDescription(userResponse.data.description || '');
    }
  }, [userResponse]);

  if (isLoading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">
          Ошибка загрузки данных пользователя
        </Typography>
      </Box>
    );
  }

  const user = userResponse?.data;

  const getRoleLabel = (role, isMentor) => {
    const roleMap = {
      ROLE_STUDENT: 'Студент',
      ROLE_TEACHER: 'Преподаватель',
      ROLE_ADMIN: 'Администратор',
      ROLE_MENTOR: 'Наставник',
    };

    if (isMentor) {
      return roleMap.ROLE_MENTOR;
    }

    return roleMap[role] || role;
  };

  const handleApplyForMentor = async data => {
    try {
      await applyForMentor({ description: data.description }).unwrap();
      toast.success('Заявка успешно отправлена!');
      setOpenModal(false);
    } catch (error) {
      if (error.status === 400) {
        toast.warning('Заявка уже отправлена');
      } else {
        toast.error('Ошибка при подаче заявки');
      }
    }
  };

  const handleEditProfile = async () => {
    try {
      await editProfile({ description }).unwrap();
      toast.success('Профиль успешно обновлен!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Ошибка при обновлении профиля');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDescription(user?.description || '');
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, width: '100%', margin: '0 auto' }}>
      <Paper
        elevation={4}
        sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}
        >
          Профиль пользователя
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 100, height: 100, fontSize: 40, bgcolor: 'primary.main' }}>
                {getInitials(user?.lastName, user?.firstName)}
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  display: 'flex',
                  alignContent: 'center',
                  textAlign: 'center',
                }}
              >
                {user?.lastName} {user?.firstName} {user?.middleName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {getRoleLabel(user?.role, user?.isMentor)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant="body1" sx={{ mr: 1 }}>
                  Рейтинг:
                </Typography>
                {Array.from({ length: 5 }, (_, index) => (
                  <FaStar
                    key={index}
                    color={index < user?.rating ? 'gold' : 'lightgray'}
                    style={{ marginLeft: 2 }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Основная информация
              </Typography>
              <Box>
                <Typography variant="body1">
                  <strong>Имя пользователя:</strong> {user?.username}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {user?.email}
                </Typography>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Учебная информация
              </Typography>
              <Box>
                <Typography variant="body1">
                  <strong>Университет:</strong> {user?.university || 'Не указано'}
                </Typography>
                <Typography variant="body1">
                  <strong>Факультет:</strong> {user?.faculty || 'Не указано'}
                </Typography>
                {user?.course && (
                  <Typography variant="body1">
                    <strong>Курс:</strong> {user?.course || 'Не указано'}
                  </Typography>
                )}
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Описание
              </Typography>
              {isEditing ? (
                <TextField
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Введите описание"
                />
              ) : (
                <Typography variant="body1">{description || 'Не указано'}</Typography>
              )}
              {isEditing ? (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleEditProfile}
                    sx={{
                      backgroundColor: theme => theme.palette.primary.main,
                      color: theme => theme.palette.common.white,
                      '&:hover': {
                        backgroundColor: theme => theme.palette.primary.dark,
                      },
                    }}
                  >
                    Сохранить изменения
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleCancelEdit}
                    sx={{
                      borderColor: theme => theme.palette.error.main,
                      color: theme => theme.palette.error.main,
                      '&:hover': {
                        borderColor: theme => theme.palette.error.dark,
                        backgroundColor: theme => theme.palette.error.light,
                        color: '#fff',
                      },
                    }}
                  >
                    Отменить
                  </Button>
                </Box>
              ) : (
                <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
                  Редактировать
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          {!user?.isMentor && user?.role !== 'ROLE_TEACHER' && (
            <Box sx={{ my: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Наставничество
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Наставничество — это возможность делиться своими знаниями и опытом с другими. Стать
                наставником — значит помочь другим развиваться и достигать своих целей. Подробное
                описание того, почему вы хотите стать наставником, важно, так как преподаватель,
                который будет рассматривать вашу заявку, должен понять, почему вы хотите стать
                наставником и как вы можете помочь другим.
              </Typography>
              <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
                Подать заявку на наставничество
              </Button>
            </Box>
          )}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Отзывы
          </Typography>
          {user?.isMentor && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Роль наставника
              </Typography>
              {isMentorReviewsLoading ? (
                <CircularProgress />
              ) : mentorReviewsResponse?.data.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                  Пока нет отзывов на вас, как на наставника.
                </Typography>
              ) : (
                mentorReviewsResponse.data.map(review => (
                  <Paper key={review.id} elevation={3} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {review.reviewer.lastName} {review.reviewer.firstName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <FaStar key={index} color={index < review.rating ? 'gold' : 'lightgray'} />
                      ))}
                    </Box>
                    <Typography variant="body2">{review.text}</Typography>
                  </Paper>
                ))
              )}
            </>
          )}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Роль студента
          </Typography>
          {isStudentReviewsLoading ? (
            <CircularProgress />
          ) : studentReviewsResponse?.data.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              Пока нет отзывов на вас, как на студента.
            </Typography>
          ) : (
            studentReviewsResponse.data.map(review => (
              <Paper key={review.id} elevation={3} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {review.reviewer.lastName} {review.reviewer.firstName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <FaStar key={index} color={index < review.rating ? 'gold' : 'lightgray'} />
                  ))}
                </Box>
                <Typography variant="body2">{review.text}</Typography>
              </Paper>
            ))
          )}
        </Box>
      </Paper>

      <MentorApplyModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleApplyForMentor}
      />
    </Box>
  );
};

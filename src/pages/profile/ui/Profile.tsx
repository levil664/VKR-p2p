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
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useApplyForMentorMutation } from '../../../entities/mentorApplication/api/mentorApplicationApi';
import { useGetReviewsForUserQuery } from '../../../entities/review/api/reviewApi';
import { useEditProfileMutation, useMeQuery } from '../../../entities/user/api/userApi';
import { MentorApplyModal } from './MentorApplyModal';
import { ReviewCard } from '../../../widgets/reviewCard/ui';

export const Profile = () => {
  const { data: userResponse, error, isLoading } = useMeQuery();
  const [applyForMentor] = useApplyForMentorMutation();
  const [editProfile] = useEditProfileMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const user = userResponse?.data;
  const isTeacher = user?.role === 'ROLE_TEACHER';

  const { data: mentorReviewsResponse, isLoading: isMentorReviewsLoading } =
    useGetReviewsForUserQuery({
      userId: user?.id || '',
      type: 'MENTOR',
      skip: !user?.id,
    });

  const { data: studentReviewsResponse, isLoading: isStudentReviewsLoading } =
    useGetReviewsForUserQuery({
      userId: user?.id || '',
      type: 'STUDENT',
      skip: !user?.id,
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

  const getRoleLabel = (role, isMentor) => {
    const roleMap = {
      ROLE_STUDENT: 'Студент',
      ROLE_TEACHER: 'Преподаватель',
      ROLE_ADMIN: 'Администратор',
      ROLE_MENTOR: 'Наставник',
    };
    return isMentor ? roleMap.ROLE_MENTOR : roleMap[role] || role;
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

  const SummaryItem = ({ label, value, isPercent = false }) => (
    <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center', height: '100%' }}>
      <Box sx={{ minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {label}
        </Typography>
      </Box>
      <Typography variant="h6" fontWeight={700}>
        {value != null
          ? isPercent
            ? `${Math.round(value * 100)}%`
            : `${value.toFixed(1)} ★`
          : '-'}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ p: 2, maxWidth: 1200, width: '100%', mx: 'auto' }}>
      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Stack spacing={3} alignItems="center">
          <Avatar sx={{ width: 100, height: 100, fontSize: 40, bgcolor: 'primary.main' }}>
            {getInitials(user?.firstName, user?.lastName)}
          </Avatar>

          <Typography variant="h5" fontWeight="bold" textAlign="center">
            {user?.lastName} {user?.firstName} {user?.middleName}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {getRoleLabel(user?.role, user?.isMentor)}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Основная информация
              </Typography>
              <Typography variant="body2">
                <strong>Имя пользователя:</strong> {user?.username}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {user?.email}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Учебная информация
              </Typography>
              <Typography variant="body2">
                <strong>Университет:</strong> {user?.university || 'Не указано'}
              </Typography>
              <Typography variant="body2">
                <strong>Факультет:</strong> {user?.faculty || 'Не указано'}
              </Typography>
              <Typography variant="body2">
                <strong>Курс:</strong> {user?.course || 'Не указано'}
              </Typography>
            </Grid>
          </Grid>

          {!isTeacher && ( // Всё, что дальше — только если НЕ преподаватель
            <>
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Описание
                </Typography>
                {isEditing ? (
                  <>
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                    <Stack direction="row" spacing={2} mt={2}>
                      <Button variant="contained" onClick={handleEditProfile}>
                        Сохранить
                      </Button>
                      <Button variant="outlined" color="error" onClick={handleCancelEdit}>
                        Отменить
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <>
                    <Typography variant="body2">{description || 'Не указано'}</Typography>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => setIsEditing(true)}>
                      Редактировать
                    </Button>
                  </>
                )}
              </Box>

              {!user?.isMentor && (
                <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, width: '100%' }}>
                  <Typography variant="h6" fontWeight={600}>
                    Наставничество
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Наставничество — это возможность делиться своими знаниями и опытом с другими.
                  </Typography>
                  <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpenModal(true)}>
                    Подать заявку
                  </Button>
                </Box>
              )}

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(5, 1fr)' },
                  gap: 2,
                  width: '100%',
                  mt: 4,
                }}
              >
                {user?.isMentor ? (
                  <>
                    <SummaryItem label="Понятность" value={user.mentorStats?.comprehensibility} />
                    <SummaryItem label="Вовлеченность" value={user.mentorStats?.involvedness} />
                    <SummaryItem
                      label="Соблюдение договоренностей"
                      value={user.mentorStats?.compliance}
                    />
                    <SummaryItem label="Польза" value={user.mentorStats?.usefulness} />
                    <SummaryItem
                      label="Обратятся снова"
                      value={user.mentorStats?.wouldAskAgainRate}
                      isPercent
                    />
                  </>
                ) : (
                  <>
                    <SummaryItem label="Подготовленность" value={user.studentStats?.preparedness} />
                    <SummaryItem label="Активность" value={user.studentStats?.activity} />
                    <SummaryItem label="Вежливость" value={user.studentStats?.politeness} />
                    <SummaryItem label="Самостоятельность" value={user.studentStats?.proactivity} />
                    <SummaryItem
                      label="Помогут снова"
                      value={user.studentStats?.wouldHelpAgainRate}
                      isPercent
                    />
                  </>
                )}
              </Box>

              <Box sx={{ width: '100%', mt: 4 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Отзывы
                </Typography>

                {user?.isMentor && (
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                      Как наставник
                    </Typography>
                    {isMentorReviewsLoading ? (
                      <CircularProgress />
                    ) : mentorReviewsResponse?.data.length === 0 ? (
                      <Typography color="text.secondary">Пока нет отзывов.</Typography>
                    ) : (
                      <Stack spacing={2}>
                        {mentorReviewsResponse.data.map(review => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                      </Stack>
                    )}
                  </Box>
                )}

                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Как студент
                  </Typography>
                  {isStudentReviewsLoading ? (
                    <CircularProgress />
                  ) : studentReviewsResponse?.data.length === 0 ? (
                    <Typography color="text.secondary">Пока нет отзывов.</Typography>
                  ) : (
                    <Stack spacing={2}>
                      {studentReviewsResponse.data.map(review => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </Stack>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Stack>
      </Paper>

      <MentorApplyModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleApplyForMentor}
      />
    </Box>
  );
};

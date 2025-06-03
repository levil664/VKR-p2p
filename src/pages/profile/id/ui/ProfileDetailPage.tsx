import { Avatar, Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { useGetReviewsForUserQuery } from '../../../../entities/review/api/reviewApi';
import { useGetUserQuery } from '../../../../entities/user/api/userApi';
import { ReviewCard } from '../../../../widgets/reviewCard/ui';

export const ProfileDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: userResponse, error, isLoading } = useGetUserQuery(id || '');
  const user = userResponse?.data;

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

  if (isLoading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
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
            {getInitials(user.firstName, user.lastName)}
          </Avatar>

          <Typography variant="h5" fontWeight="bold" textAlign="center">
            {user.lastName} {user.firstName} {user.middleName}
          </Typography>

          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Описание
            </Typography>
            <Typography variant="body2">{user.description || 'Не указано'}</Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(5, 1fr)' },
              gap: 2,
              width: '100%',
              mt: 4,
            }}
          >
            {user.isMentor ? (
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

            {user.isMentor && (
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
        </Stack>
      </Paper>
    </Box>
  );
};

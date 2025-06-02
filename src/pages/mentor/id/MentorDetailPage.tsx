import { Avatar, Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { useGetReviewsForUserQuery } from '../../../entities/review/api/reviewApi';
import { useGetUserQuery } from '../../../entities/user/api/userApi';
import { ReviewCard } from '../../../widgets/reviewCard/ui';

export const MentorDetailPage = () => {
  const { id } = useParams();
  const { data: userResponse, error, isLoading } = useGetUserQuery(id);
  const { data: reviewsResponse, isLoading: isReviewsLoading } = useGetReviewsForUserQuery({
    userId: id,
    type: 'MENTOR',
  });

  const user = userResponse?.data;
  const reviews = reviewsResponse?.data || [];

  const getInitials = (firstName, lastName) =>
    `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();

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

  const SummaryItem = ({ label, value, isPercent = false }) => (
    <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
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
      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, mb: 4 }}>
        <Stack spacing={3} alignItems="center">
          <Avatar sx={{ width: 120, height: 120, fontSize: 42, bgcolor: 'primary.main' }}>
            {getInitials(user?.firstName, user?.lastName)}
          </Avatar>

          <Typography variant="h5" fontWeight="bold" textAlign="center">
            {user?.lastName} {user?.firstName} {user?.middleName}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {user?.isMentor ? 'Наставник' : 'Пользователь'}
          </Typography>

          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Описание
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.description || 'Нет описания'}
            </Typography>
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
            <SummaryItem label="Понятность" value={user.mentorStats?.comprehensibility} />
            <SummaryItem label="Вовлеченность" value={user.mentorStats?.involvedness} />
            <SummaryItem label="Соблюдение договоренностей" value={user.mentorStats?.compliance} />
            <SummaryItem label="Польза" value={user.mentorStats?.usefulness} />
            <SummaryItem
              label="Обратятся снова"
              value={user.mentorStats?.wouldAskAgainRate}
              isPercent
            />
          </Box>
        </Stack>
      </Paper>

      <Typography variant="h6" fontWeight={600} mb={2}>
        Отзывы о наставнике
      </Typography>

      {isReviewsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      ) : reviews.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Пока нет отзывов.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

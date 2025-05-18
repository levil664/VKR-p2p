import { Avatar, Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { FaStar } from 'react-icons/fa';
import { useGetUserQuery } from '../../../entities/user/api/userApi';
import { useGetReviewsForUserQuery } from '../../../entities/review/api/reviewApi';
import { useParams } from 'react-router';

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

  const renderRatingStars = rating => {
    const fullStars = Math.round(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} color={i < fullStars ? 'gold' : '#e0e0e0'} style={{ marginRight: 4 }} />
    ));
  };

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

  return (
    <Box sx={{ p: 3, maxWidth: 800, width: '100%', margin: '0 auto' }}>
      <Paper
        elevation={4}
        sx={{ p: 4, borderRadius: '16px', boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)', mb: 4 }}
      >
        <Stack spacing={3} alignItems="center">
          <Avatar sx={{ width: 120, height: 120, fontSize: 42, bgcolor: 'primary.main' }}>
            {getInitials(user?.firstName, user?.lastName)}
          </Avatar>

          <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            {user?.lastName} {user?.firstName} {user?.middleName}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {user?.isMentor ? 'Наставник' : 'Пользователь'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderRatingStars(user?.rating || 0)}
          </Box>

          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Описание
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.description || 'Нет описания'}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
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
            <Paper
              key={review.id}
              elevation={3}
              sx={{
                p: 2,
                borderRadius: '12px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  {getInitials(review.reviewer.firstName, review.reviewer.lastName)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {review.reviewer.lastName} {review.reviewer.firstName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {renderRatingStars(review.rating)}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(review.createdOn).toLocaleDateString()}
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {review.text}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

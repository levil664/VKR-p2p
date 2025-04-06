import { Avatar, Box, CircularProgress, Grid, Paper, Stack, Typography } from '@mui/material';
import { useMeQuery } from '../../../entities/user/api/userApi';

export const Profile = () => {
  const { data: userResponse, error, isLoading } = useMeQuery();

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

  const getRoleLabel = role => {
    const roleMap = {
      ROLE_STUDENT: 'Студент',
      ROLE_TEACHER: 'Преподаватель',
      ROLE_ADMIN: 'Администратор',
    };
    return roleMap[role] || role;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
          Профиль пользователя
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 100, height: 100, fontSize: 40, bgcolor: 'primary.main' }}>
                {user?.firstName?.[0] || 'U'}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {getRoleLabel(user?.role)}
              </Typography>
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
                <Typography variant="body1">
                  <strong>Курс:</strong> {user?.course || 'Не указано'}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

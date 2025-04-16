import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { useMeQuery } from '../../../entities/user/api/userApi';
import React, { useState } from 'react';
import { useApplyForMentorMutation } from '../../../entities/mentorApplicationApi/api/mentorApplicationApi';
import { MentorApplyModal } from './MentorApplyModal';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Profile = () => {
  const { data: userResponse, error, isLoading } = useMeQuery();
  const [openModal, setOpenModal] = useState(false);
  const [applyForMentor] = useApplyForMentorMutation();
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
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

  const handleApplyForMentor = async (data: { description: string }) => {
    try {
      await applyForMentor({ description: data.description }).unwrap();
      setOpenModal(false);
      setNotification({ open: true, message: 'Заявка успешно отправлена!', severity: 'success' });
    } catch (error) {
      if (error.status === 400) {
        setNotification({ open: true, message: 'Заявка уже отправлена', severity: 'warning' });
      } else {
        console.error('Ошибка при подаче заявки на наставничество:', error);
      }
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
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
                {getInitials(user?.firstName, user?.lastName)}
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

        <Box sx={{ mt: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Наставничество
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Наставничество — это возможность делиться своими знаниями и опытом с другими. Стать
            наставником — значит помочь другим развиваться и достигать своих целей. Заполнение всех
            полей заявки важно, так как преподаватель, который будет рассматривать вашу заявку,
            должен понять, почему вы хотите стать наставником и как вы можете помочь другим.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
            Подать заявку на наставничество
          </Button>
        </Box>
      </Paper>

      <MentorApplyModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleApplyForMentor}
      />

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

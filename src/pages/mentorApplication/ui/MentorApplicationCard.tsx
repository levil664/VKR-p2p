import { Box, Button, Card, CardContent, Snackbar, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import React, { useState } from 'react';
import {
  useApproveMentorApplicationMutation,
  useRejectMentorApplicationMutation,
} from '../../../entities/mentorApplicationApi/api/mentorApplicationApi';
import { MentorApplicationDto } from '../../../entities/mentorApplicationApi/model/types';
import { MentorApplicationStatus } from '../lib/enums';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface Props {
  application: MentorApplicationDto;
}

export const MentorApplicationCard = ({ application }: Props) => {
  const [approve] = useApproveMentorApplicationMutation();
  const [reject] = useRejectMentorApplicationMutation();
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleApprove = async () => {
    try {
      await approve(application.id).unwrap();
      setNotification({ open: true, message: 'Заявка успешно принята', severity: 'success' });
    } catch (error) {
      console.error('Ошибка при принятии заявки:', error);
    }
  };

  const handleReject = async () => {
    try {
      await reject(application.id).unwrap();
      setNotification({ open: true, message: 'Заявка успешно отклонена', severity: 'warning' });
    } catch (error) {
      console.error('Ошибка при отклонении заявки:', error);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Card
      sx={{
        p: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        boxShadow: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {application.student.firstName} {application.student.lastName}
        </Typography>

        <Typography variant="body2" sx={{ mb: 4 }}>
          {application.description}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Статус:</strong>{' '}
              <span>{MentorApplicationStatus[application.state].label}</span>
            </Typography>
            <Typography variant="body2">
              <strong>Создано:</strong> {new Date(application.createdOn).toLocaleDateString()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignSelf: 'end' }}>
            <Button variant="contained" color="primary" onClick={handleApprove} size="small">
              Принять
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleReject}
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
              Отклонить
            </Button>
          </Box>
        </Box>
      </CardContent>

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

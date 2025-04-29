import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import {
  useApproveMentorApplicationMutation,
  useRejectMentorApplicationMutation,
} from '../../../entities/mentorApplication/api/mentorApplicationApi';
import { MentorApplicationDto } from '../../../entities/mentorApplication/model/types';
import { MentorApplicationStatus } from '../lib/enums';

interface Props {
  application: MentorApplicationDto;
}

export const MentorApplicationCard = ({ application }: Props) => {
  const [approve] = useApproveMentorApplicationMutation();
  const [reject] = useRejectMentorApplicationMutation();

  const handleApprove = async () => {
    try {
      await approve(application.id).unwrap();
      toast.success('Заявка успешно принята');
    } catch (error) {
      toast.error('Ошибка при принятии заявки');
    }
  };

  const handleReject = async () => {
    try {
      await reject(application.id).unwrap();
      toast.warning('Заявка успешно отклонена');
    } catch (error) {
      toast.error('Ошибка при отклонении заявки');
    }
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
    </Card>
  );
};

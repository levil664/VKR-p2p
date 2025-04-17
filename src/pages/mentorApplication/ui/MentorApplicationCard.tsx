import { Card, CardContent, Typography } from '@mui/material';
import { MentorApplicationDto } from '../../../entities/mentorApplicationApi/model/types';
import { MentorApplicationStatus } from '../lib/enums';

interface Props {
  application: MentorApplicationDto;
}

export const MentorApplicationCard = ({ application }: Props) => {
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
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Статус:</strong> <span>{MentorApplicationStatus[application.state].label}</span>
        </Typography>
        <Typography variant="body2">
          <strong>Создано:</strong> {new Date(application.createdOn).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

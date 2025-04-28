import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import {
  useApproveMentorApplicationMutation,
  useRejectMentorApplicationMutation,
} from '../../../entities/mentorApplicationApi/api/mentorApplicationApi';
import { MentorApplicationDto } from '../../../entities/mentorApplicationApi/model/types';
import { MentorApplicationStatus } from '../lib/enums';

interface Props {
  applications: MentorApplicationDto[];
}

export const MentorApplicationTable = ({ applications }: Props) => {
  const [approveApplication] = useApproveMentorApplicationMutation();
  const [rejectApplication] = useRejectMentorApplicationMutation();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>ФИО студента</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Описание</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Статус</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Создано</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map(app => (
            <TableRow key={app.id} hover sx={{ cursor: 'default' }}>
              <TableCell>{`${app.student.firstName} ${app.student.lastName}`}</TableCell>
              <TableCell sx={{ maxWidth: 300 }}>
                <Tooltip title={app.description} arrow disableInteractive>
                  <span
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                    }}
                  >
                    {app.description}
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Box
                  sx={{
                    border: `1px solid ${MentorApplicationStatus[app.state].color}`,
                    borderRadius: '4px',
                    px: 1,
                    py: 0.5,
                    display: 'inline-block',
                    color: MentorApplicationStatus[app.state].color,
                  }}
                >
                  {MentorApplicationStatus[app.state].label}
                </Box>
              </TableCell>
              <TableCell>{new Date(app.createdOn).toLocaleDateString()}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => approveApplication(app.id)}
                  >
                    Принять
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => rejectApplication(app.id)}
                    sx={{
                      borderColor: theme => theme.palette.error.main,
                      color: theme => theme.palette.error.main,
                      '&:hover': {
                        borderColor: theme => theme.palette.error.dark,
                        backgroundColor: theme => theme.palette.error.light,
                      },
                    }}
                  >
                    Отклонить
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

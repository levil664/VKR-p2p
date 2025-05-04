import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router';

export const GroupMeetingTable = ({ groupMeetings }) => {
  const navigate = useNavigate();

  const handleRowClick = id => {
    navigate(`/group-meeting/${id}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Название</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Описание</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Дата начала</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Дата окончания</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Создано</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groupMeetings.map(meeting => (
            <TableRow
              key={meeting.id}
              hover
              onClick={() => handleRowClick(meeting.id)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                <Tooltip title={meeting.title} placement="top-start" arrow disableInteractive>
                  <span>{meeting.title}</span>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title={meeting.description} placement="top-start" arrow disableInteractive>
                  <span>{meeting.description}</span>
                </Tooltip>
              </TableCell>
              <TableCell>{new Date(meeting.startDt).toLocaleString()}</TableCell>
              <TableCell>{new Date(meeting.endDt).toLocaleString()}</TableCell>
              <TableCell>{new Date(meeting.createdOn).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

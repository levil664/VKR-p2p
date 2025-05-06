import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useNavigate } from 'react-router';

export const ChatTable = ({ chats }) => {
  const navigate = useNavigate();

  const handleRowClick = id => {
    navigate(`/chat/${id}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Название</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Участники</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chats.map(chat => (
            <TableRow
              key={chat.id}
              hover
              onClick={() => handleRowClick(chat.id)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>{chat.title}</TableCell>
              <TableCell>{chat.participants.map(p => p.firstName).join(', ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { useAppSelector } from '../../../app/api';

export const ChatTable = ({ chats }) => {
  const navigate = useNavigate();
  const currentUserId = useAppSelector(state => state.user.id);

  const handleRowClick = id => {
    navigate(`/chat/${id}`);
  };

  const handleAdvertClick = advertId => {
    navigate(`/advert/${advertId}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Участники</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Заявка</TableCell>
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
              <TableCell>
                {chat.participants
                  .filter(p => p.id !== currentUserId)
                  .map(p => `${p.firstName} ${p.lastName}`)
                  .join(', ')}
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    handleAdvertClick(chat.advertId);
                  }}
                >
                  Заявка
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

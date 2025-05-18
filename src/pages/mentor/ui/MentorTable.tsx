import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router';

export const MentorTable = ({ mentors }) => {
  const navigate = useNavigate();

  const handleRowClick = id => {
    navigate(`/mentor/${id}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>ФИО</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>О себе</TableCell>
            <TableCell sx={{ fontWeight: 'bold', minWidth: '128px' }}>Рейтинг</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mentors.map(mentor => (
            <TableRow
              key={mentor.id}
              hover
              onClick={() => handleRowClick(mentor.id)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>{`${mentor.lastName} ${mentor.firstName} ${mentor.middleName}`}</TableCell>
              <TableCell>{mentor.description || '-'}</TableCell>
              <TableCell>
                {mentor.rating || 0}
                {Array.from({ length: 5 }, (_, index) => (
                  <FaStar
                    key={index}
                    color={index < (mentor.rating || 0) ? 'gold' : 'lightgray'}
                    style={{ marginLeft: 2 }}
                  />
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

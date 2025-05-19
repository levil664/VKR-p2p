import {
  Box,
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
import { AdvertStatus } from '../../../entities/advert/model/enums';

export const AdvertTable = ({ adverts }) => {
  const navigate = useNavigate();

  const handleRowClick = id => {
    navigate(`/advert/${id}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Название</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Описание</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Статус</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Создано</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Автор</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Роль</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {adverts.map(advert => (
            <TableRow
              key={advert.id}
              hover
              onClick={() => handleRowClick(advert.id)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell
                sx={{
                  maxWidth: 200,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <Tooltip title={advert.title} placement="top-start" arrow disableInteractive>
                  <span>{advert.title}</span>
                </Tooltip>
              </TableCell>
              <TableCell
                sx={{
                  maxWidth: 300,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <Tooltip title={advert.description} placement="top-start" arrow disableInteractive>
                  <span>{advert.description}</span>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Box
                  sx={{
                    border: `1px solid ${AdvertStatus[advert.status]?.color || 'gray'}`,
                    borderRadius: '4px',
                    padding: '4px 8px',
                    display: 'inline-block',
                    color: AdvertStatus[advert.status]?.color || 'black',
                  }}
                >
                  {AdvertStatus[advert.status]?.label || 'Неизвестный статус'}
                </Box>
              </TableCell>
              <TableCell>{new Date(advert.createdOn).toLocaleDateString()}</TableCell>
              <TableCell>
                {advert.student
                  ? `${advert.student.lastName} ${advert.student.firstName} ${advert.student.middleName}`
                  : `${advert.mentor.lastName} ${advert.mentor.firstName} ${advert.mentor.middleName}`}
              </TableCell>
              <TableCell>{advert.student ? 'Студент' : 'Наставник'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

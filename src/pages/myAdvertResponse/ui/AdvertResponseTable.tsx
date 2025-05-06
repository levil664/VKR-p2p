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
import { useNavigate } from 'react-router';
import { AdvertStatus } from '../../../entities/advert/model/enums';
import { theme } from '../../../app/theme';

export const AdvertResponseTable = ({ responses }) => {
  const navigate = useNavigate();

  const handleRowClick = responseId => {
    navigate(`/advert/${responseId}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Объявление</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Описание</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Статус</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Создано</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Автор</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Роль</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {responses.map(response => (
            <TableRow
              key={response.advert.id}
              hover
              onClick={() => handleRowClick(response.advert.id)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                <Tooltip
                  title={response.advert.title}
                  placement="top-start"
                  arrow
                  disableInteractive
                >
                  <span>{response.advert.title}</span>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip
                  title={response.advert.description}
                  placement="top-start"
                  arrow
                  disableInteractive
                >
                  <span>{response.advert.description}</span>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Box
                  sx={{
                    border: `1px solid ${AdvertStatus[response.advert.status]?.color}`,
                    borderRadius: '4px',
                    padding: '4px 8px',
                    display: 'inline-block',
                    color: AdvertStatus[response.advert.status]?.color,
                  }}
                >
                  {AdvertStatus[response.advert.status]?.label}
                </Box>
              </TableCell>
              <TableCell>{new Date(response.advert.createdOn).toLocaleDateString()}</TableCell>
              <TableCell>
                {response.advert.student
                  ? `${response.advert.student.firstName} ${response.advert.student.lastName}`
                  : 'Не указан'}
              </TableCell>
              <TableCell>{response.advert.student?.isMentor ? 'Наставник' : 'Студент'}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/chat/${response?.chatId}`)}
                  sx={{
                    borderColor: theme.palette.info.main,
                    color: theme.palette.info.main,
                    '&:hover': {
                      backgroundColor: theme.palette.info.light,
                      borderColor: theme.palette.info.dark,
                      color: '#fff',
                    },
                  }}
                >
                  Чат
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

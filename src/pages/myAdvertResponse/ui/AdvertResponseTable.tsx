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
import { toast } from 'react-toastify';
import { theme } from '../../../app/theme';
import { AdvertStatus } from '../../../entities/advert/model/enums';
import { useDeleteAdvertResponseMutation } from '../../../entities/advertResponse/api/advertResponseApi';

export const AdvertResponseTable = ({ responses }) => {
  const navigate = useNavigate();
  const [deleteAdvertResponse] = useDeleteAdvertResponseMutation();

  const handleRowClick = responseId => {
    navigate(`/advert/${responseId}`);
  };

  const handleDelete = async (advertId, responseId) => {
    try {
      await deleteAdvertResponse({ advertId, responseId }).unwrap();
      toast.success('Отклик удален!');
    } catch (error) {
      toast.error(error.data.message);
    }
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
            <TableCell sx={{ fontWeight: 'bold' }}>Роль</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}></TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}></TableCell>
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
              <TableCell>{response.advert.student?.isMentor ? 'Наставник' : 'Студент'}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={e => {
                    e.stopPropagation();
                    navigate(`/chat/${response?.response.chatId}`);
                  }}
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
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete(response.advert.id, response.response.id);
                  }}
                  sx={{
                    borderColor: theme.palette.error.main,
                    color: theme.palette.error.main,
                    '&:hover': {
                      backgroundColor: theme.palette.error.light,
                      borderColor: theme.palette.error.dark,
                      color: '#fff',
                    },
                  }}
                >
                  Удалить
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import {
  useDeleteGroupMeetingMutation,
  useGetGroupMeetingQuery,
  useUpdateGroupMeetingMutation,
} from '../../../../entities/groupMeetings/api';

const inputStyles = {
  width: { xs: '100%', sm: '100%', lg: 600 },
  maxWidth: '600px',
  backgroundColor: 'white',
  '& .MuiInputBase-input': {
    color: 'black',
  },
};

export const GroupMeetingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: meetingData, isLoading } = useGetGroupMeetingQuery(id);
  const [updateMeeting] = useUpdateGroupMeetingMutation();
  const [deleteMeeting] = useDeleteGroupMeetingMutation();

  const [openDialog, setOpenDialog] = useState(false);

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      title: '',
      description: '',
      startDt: '',
      startTime: '',
      endDt: '',
      endTime: '',
    },
  });

  useEffect(() => {
    if (meetingData) {
      const startDate = new Date(meetingData.data.startDt);
      const endDate = new Date(meetingData.data.endDt);

      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      const formatTime = (date: Date) => date.toISOString().split('T')[1].substring(0, 5);

      setValue('title', meetingData.data.title);
      setValue('description', meetingData.data.description);
      setValue('startDt', formatDate(startDate));
      setValue('startTime', formatTime(startDate));
      setValue('endDt', formatDate(endDate));
      setValue('endTime', formatTime(endDate));
    }
  }, [meetingData, setValue]);

  const handleUpdate = async data => {
    try {
      await updateMeeting({ id, body: data }).unwrap();
      toast.success('Групповая встреча обновлена!');
    } catch (error) {
      toast.error(error.data.message || 'Ошибка при обновлении.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMeeting(id).unwrap();
      toast.success('Встреча удалена!');
      navigate('/group-meetings');
    } catch (error) {
      toast.error(error.data.message || 'Ошибка при удалении.');
    } finally {
      setOpenDialog(false);
    }
  };

  if (isLoading) return <Typography>Загрузка...</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4">Групповая встреча: {meetingData.data.title}</Typography>

      <form onSubmit={handleSubmit(handleUpdate)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Название"
                fullWidth
                margin="normal"
                required
                sx={inputStyles}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Описание"
                fullWidth
                multiline
                rows={4}
                margin="normal"
                required
                sx={inputStyles}
              />
            )}
          />
          <Controller
            name="startDt"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="date"
                label="Дата начала"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
                sx={inputStyles}
              />
            )}
          />
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="time"
                label="Время начала"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
                sx={inputStyles}
              />
            )}
          />
          <Controller
            name="endDt"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="date"
                label="Дата окончания"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
                sx={inputStyles}
              />
            )}
          />
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="time"
                label="Время окончания"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
                sx={inputStyles}
              />
            )}
          />

          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Сохранить
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenDialog(true)}
              sx={{
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                ml: 2,
                '&:hover': {
                  borderColor: theme.palette.error.dark,
                  backgroundColor: theme.palette.error.light,
                  color: '#fff',
                },
              }}
            >
              Удалить встречу
            </Button>
          </Box>
        </Box>
      </form>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Удаление встречи</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить эту групповую встречу? Это действие необратимо.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

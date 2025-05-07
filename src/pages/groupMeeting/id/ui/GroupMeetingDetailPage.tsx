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
import { useNavigate, useParams } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  useDeleteGroupMeetingMutation,
  useGetGroupMeetingQuery,
  useGetGroupMeetingUrlQuery,
  useUpdateGroupMeetingMutation,
} from '../../../../entities/groupMeetings/api';
import { useAppSelector } from '../../../../app/api';

export const formatMeetingData = (data: any) => {
  const startDateTime = new Date(`${data.startDt}T${data.startTime}`);
  const endDateTime = new Date(`${data.endDt}T${data.endTime}`);

  return {
    ...data,
    startDt: startDateTime.toISOString(),
    endDt: endDateTime.toISOString(),
  };
};

export const GroupMeetingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: meetingData, isLoading } = useGetGroupMeetingQuery(id);
  const { data: urlData, isLoading: isUrlLoading } = useGetGroupMeetingUrlQuery(id); // <--- добавил запрос на URL
  const [updateMeeting] = useUpdateGroupMeetingMutation();
  const [deleteMeeting] = useDeleteGroupMeetingMutation();

  const [openDialog, setOpenDialog] = useState(false);

  const currentUserId = useAppSelector(state => state.user.id);
  const isAuthor = meetingData?.data.creator.id === currentUserId;

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
      const { title, description, startDt, endDt } = meetingData.data;
      setValue('title', title);
      setValue('description', description);
      setValue('startDt', startDt);
      setValue('endDt', endDt);
    }
  }, [meetingData, setValue]);

  const handleConfirmDelete = async () => {
    try {
      await deleteMeeting(id).unwrap();
      toast.success('Встреча удалена!');
      navigate('/group-meetings');
    } catch (error: any) {
      toast.error(error.data?.message || 'Ошибка при удалении.');
    } finally {
      setOpenDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
  };

  const handleUpdateMeeting = async (data: any) => {
    try {
      const formattedData = formatMeetingData(data);
      await updateMeeting({ id, body: formattedData }).unwrap();
      toast.success('Встреча обновлена!');
    } catch (error: any) {
      toast.error(error.data?.message || 'Ошибка при обновлении.');
    }
  };

  if (isLoading) return <Typography>Загрузка...</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4">Встреча: {meetingData?.data.title}</Typography>

      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Удалить встречу?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить эту встречу? Это действие необратимо.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Отмена</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      <Box>
        <form onSubmit={handleSubmit(handleUpdateMeeting)}>
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
                InputProps={{ readOnly: !isAuthor }}
                sx={{ backgroundColor: 'white' }}
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
                margin="normal"
                multiline
                rows={4}
                required
                InputProps={{ readOnly: !isAuthor }}
                sx={{ backgroundColor: 'white' }}
              />
            )}
          />

          <Controller
            name="startDt"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Дата начала"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: !isAuthor }}
                sx={{ backgroundColor: 'white' }}
              />
            )}
          />

          <Controller
            name="endDt"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Дата окончания"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: !isAuthor }}
                sx={{ backgroundColor: 'white' }}
              />
            )}
          />

          <TextField
            label="Ссылка на BigBlueButton"
            value={
              isUrlLoading
                ? 'Загрузка...'
                : urlData?.data ||
                  'Пока что нет ссылки на встречу, она появится ближе к назначенному времени'
            }
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            sx={{ backgroundColor: 'white' }}
          />

          {isAuthor && (
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
                Удалить
              </Button>
            </Box>
          )}
        </form>
      </Box>
    </Box>
  );
};

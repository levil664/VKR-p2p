import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../../../app/api';
import {
  useAttendGroupMeetingMutation,
  useDeleteGroupMeetingMutation,
  useGetGroupMeetingQuery,
  useGetGroupMeetingUrlQuery,
  useUnattendGroupMeetingMutation,
  useUpdateGroupMeetingMutation,
} from '../../../../entities/groupMeetings/api';

const inputStyles = {
  width: { xs: '100%', md: 400, lg: 600 },
  maxWidth: '600px',
  backgroundColor: 'white',
  '& .MuiInputBase-input': {
    color: 'black',
  },
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const today = new Date();
const minDate = formatDate(today);

const oneYearLater = new Date();
oneYearLater.setFullYear(today.getFullYear() + 1);
const maxDate = formatDate(oneYearLater);

export const GroupMeetingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: meetingData, isLoading, refetch } = useGetGroupMeetingQuery(id);
  const { data: meetingUrlData, isLoading: isUrlLoading } = useGetGroupMeetingUrlQuery(id);

  const currentUserId = useAppSelector(state => state.user.id);
  const isAuthor = meetingData?.data?.creator?.id === currentUserId;

  const [updateMeeting] = useUpdateGroupMeetingMutation();
  const [deleteMeeting] = useDeleteGroupMeetingMutation();
  const [attendMeeting] = useAttendGroupMeetingMutation();
  const [unattendMeeting] = useUnattendGroupMeetingMutation();

  const [openDialog, setOpenDialog] = useState(false);

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      startDt: '',
      startTime: '',
      endDt: '',
      endTime: '',
    },
  });

  const startDt = watch('startDt');

  useEffect(() => {
    if (meetingData) {
      const startDate = new Date(meetingData?.data?.startDt);
      const endDate = new Date(meetingData?.data?.endDt);

      const formatDateLocal = (date: Date) => date.toISOString().split('T')[0];
      const formatTimeLocal = (date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      setValue('title', meetingData?.data?.title);
      setValue('description', meetingData?.data?.description);
      setValue('startDt', formatDateLocal(startDate));
      setValue('startTime', formatTimeLocal(startDate));
      setValue('endDt', formatDateLocal(endDate));
      setValue('endTime', formatTimeLocal(endDate));
    }
  }, [meetingData, setValue]);

  const handleUpdate = async data => {
    try {
      const startDateTime = new Date(`${data?.startDt}T${data?.startTime}:00`).toISOString();
      const endDateTime = new Date(`${data?.endDt}T${data?.endTime}:00`).toISOString();

      await updateMeeting({
        id,
        body: {
          title: data?.title,
          description: data?.description,
          startDt: startDateTime,
          endDt: endDateTime,
        },
      }).unwrap();
      toast.success('Групповая встреча обновлена!');
    } catch (error) {
      toast.error(error.data?.message || 'Ошибка при обновлении.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMeeting(id).unwrap();
      toast.success('Встреча удалена!');
      navigate('../');
    } catch (error) {
      toast.error(error.data?.message || 'Ошибка при удалении.');
    } finally {
      setOpenDialog(false);
    }
  };

  const handleAttendToggle = async () => {
    try {
      if (meetingData?.data?.isAttending) {
        await unattendMeeting(id).unwrap();
        toast.success('Вы отменили участие.');
      } else {
        await attendMeeting(id).unwrap();
        toast.success('Вы отметили участие.');
      }
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Ошибка изменения участия.');
    }
  };

  if (isLoading) return <Typography>Загрузка...</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4">Групповая встреча: {meetingData?.data?.title || '—'}</Typography>

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
                InputProps={{
                  readOnly: !isAuthor,
                }}
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
                InputProps={{
                  readOnly: !isAuthor,
                }}
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
                InputProps={{
                  readOnly: !isAuthor,
                  inputProps: {
                    min: minDate,
                    max: maxDate,
                  },
                }}
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
                InputProps={{
                  readOnly: !isAuthor,
                }}
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
                InputProps={{
                  readOnly: !isAuthor,
                  inputProps: {
                    min: startDt || minDate,
                    max: maxDate,
                  },
                }}
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
                InputProps={{
                  readOnly: !isAuthor,
                }}
              />
            )}
          />

          {meetingUrlData?.data && (
            <Button
              variant="contained"
              color="primary"
              href={meetingUrlData?.data}
              target="_blank"
              rel="noopener noreferrer"
              fullWidth
              sx={{
                whiteSpace: 'nowrap',
                flexShrink: 0,
                width: { xs: '100%', md: 400, lg: 600 },
                maxWidth: '600px',
              }}
            >
              Подключиться к встрече
            </Button>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mt: 2,
              width: { xs: '100%', md: 400, lg: 600 },
              maxWidth: '400px',
            }}
          >
            <Typography>
              Количество участников: <strong>{meetingData?.data?.attendeeCount || 0}</strong>
            </Typography>

            <Button
              variant={meetingData?.data?.isAttending ? 'outlined' : 'contained'}
              color={meetingData?.data?.isAttending ? 'error' : 'success'}
              onClick={handleAttendToggle}
              sx={{
                whiteSpace: 'nowrap',
                flexShrink: 0,
                width: { xs: '100%', md: 400, lg: 600 },
                maxWidth: '184px',
              }}
            >
              {meetingData?.data?.isAttending ? 'Отменить участие' : 'Участвую'}
            </Button>
          </Box>

          <Box
            sx={{
              width: { xs: '100%', lg: 600 },
              maxWidth: '600px',
              pb: 6,
              mt: 2,
            }}
          >
            {isAuthor && (
              <Stack direction="row" flexWrap="wrap" display="flex" gap="16px">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    maxWidth: 192,
                  }}
                >
                  Сохранить
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setOpenDialog(true)}
                  fullWidth
                  sx={{
                    maxWidth: 192,
                    borderColor: theme.palette.error.main,
                    color: theme.palette.error.main,
                    '&:hover': {
                      borderColor: theme.palette.error.dark,
                      backgroundColor: theme.palette.error.light,
                      color: '#fff',
                    },
                  }}
                >
                  Удалить встречу
                </Button>
              </Stack>
            )}
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

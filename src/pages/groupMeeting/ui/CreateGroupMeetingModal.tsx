import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { CreateGroupMeetingRequest } from '../../../entities/groupMeetings/model';

interface CreateGroupMeetingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGroupMeetingRequest) => void;
}

export const CreateGroupMeetingModal: React.FC<CreateGroupMeetingModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const { control, handleSubmit, reset } = useForm<CreateGroupMeetingRequest>({
    defaultValues: {
      title: '',
      description: '',
      startDt: '',
      endDt: '',
    },
  });

  const handleFormSubmit = (data: CreateGroupMeetingRequest) => {
    const startDateTime = new Date(`${data.startDt}T${data.startTime}`);
    const endDateTime = new Date(`${data.endDt}T${data.endTime}`);

    const formattedData = {
      title: data.title,
      description: data.description,
      startDt: startDateTime.toISOString(),
      endDt: endDateTime.toISOString(),
    };

    onSubmit(formattedData);
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Создать групповое занятие
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Название" fullWidth margin="normal" required />
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
                required
                InputLabelProps={{
                  shrink: true,
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
                label="Время начала"
                type="time"
                fullWidth
                margin="normal"
                required
                InputLabelProps={{
                  shrink: true,
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
                label="Дата окончания"
                type="date"
                fullWidth
                margin="normal"
                required
                InputLabelProps={{
                  shrink: true,
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
                label="Время окончания"
                type="time"
                fullWidth
                margin="normal"
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={onClose}>Отмена</Button>
            <Button type="submit" variant="contained" color="primary">
              Создать
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

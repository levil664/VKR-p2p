import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

interface MentorApplyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { description: string }) => void;
}

export const MentorApplyModal: React.FC<MentorApplyModalProps> = ({ open, onClose, onSubmit }) => {
  const { control, handleSubmit, reset } = useForm<{ description: string }>({
    defaultValues: {
      description: '',
    },
  });

  const handleFormSubmit = (data: { description: string }) => {
    onSubmit({ description: data.description });
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
          width: 800,
          maxWidth: '90%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Заявка на наставничество
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Опишите, почему вы хотите стать наставником"
                fullWidth
                margin="normal"
                multiline
                rows={6}
                required
              />
            )}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={onClose}>Отмена</Button>
            <Button type="submit" variant="contained" color="primary">
              Подать заявку
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

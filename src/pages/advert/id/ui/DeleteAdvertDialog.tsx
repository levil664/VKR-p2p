import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const DeleteAdvertDialog = ({ open, onClose, onConfirm }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          maxWidth: '500px',
          p: 1,
          borderRadius: 4,
          backgroundColor: '#fefefe',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'text.primary',
        }}
      >
        Удалить заявку?
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          Вы уверены, что хотите удалить эту заявку? Это действие невозможно отменить.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-start', p: 3 }}>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          sx={{
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Удалить
        </Button>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: theme.palette.error.main,
            color: theme.palette.error.main,
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              borderColor: theme.palette.error.dark,
              backgroundColor: theme.palette.error.light,
              color: '#fff',
            },
          }}
        >
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  );
};

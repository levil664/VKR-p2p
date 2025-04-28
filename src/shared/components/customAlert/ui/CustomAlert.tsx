import { Alert, Snackbar } from '@mui/material';
import { SyntheticEvent } from 'react';

interface Props {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  open: boolean;
  onClose: () => void;
}

export const CustomAlert = ({ type, message, open, onClose }: Props) => {
  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert severity={type} onClose={handleClose} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

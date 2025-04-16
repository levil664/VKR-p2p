import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import React, { useState } from 'react';
import { RegisterForm } from '../../../widgets/registerForm/ui';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Register: React.FC = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSuccess = () => {
    setNotification({ open: true, message: 'Регистрация прошла успешно!', severity: 'success' });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
      <RegisterForm
        title="Регистрация"
        buttonText="Зарегистрироваться"
        links={[{ text: 'Уже есть аккаунт?', href: '/login' }]}
        onSuccess={handleSuccess}
      />
      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

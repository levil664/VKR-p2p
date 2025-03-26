import React from 'react';
import { AuthForm } from '../../../widgets/authForm/ui';

export const Login: React.FC = () => {
  return (
    <AuthForm
      title="Вход"
      fields={[
        { label: 'Email', type: 'email', name: 'username' },
        { label: 'Пароль', type: 'password', name: 'password' },
      ]}
      buttonText="Войти"
      links={[
        { text: 'Вход с помощью ЛК', href: '#' },
        { text: ' Регистрация', href: '/register' },
      ]}
    />
  );
};

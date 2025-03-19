import React from 'react';
import { AuthForm } from '../../../widgets/authForm/ui';

export const Register: React.FC = () => {
  return (
    <AuthForm
      title="Регистрация"
      fields={[
        { label: 'Имя', type: 'text' },
        { label: 'Email', type: 'email' },
        { label: 'Пароль', type: 'password' },
      ]}
      buttonText="Зарегистрироваться"
      links={[{ text: 'Уже есть аккаунт?', href: '/login' }]}
    />
  );
};

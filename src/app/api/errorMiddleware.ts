import { isRejected, Middleware } from '@reduxjs/toolkit';
import { ErrorType } from './commonApi';

interface Action {
  type: string;
  payload: ErrorType;
}

export const ErrorMiddleware: Middleware = () => next => (action: Action) => {
  if (isRejected()(action)) {
    const { status, data } = action.payload;

    if (400 <= status && status < 500) {
      if (status === 404) {
        console.error('Объект не найден!');
      } else {
        if (data && data.error) {
          console.error(data.error.message || 'Ошибка клиента');
        }
      }
    }
    if (status >= 500) {
      console.error('Ошибка сервера! Попробуйте выполнить запрос позже');
    }
  }
  return next(action);
};

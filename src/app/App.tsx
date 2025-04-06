import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from './api';
import { AppRoutes } from './appRoutes';
import { theme } from './theme';

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

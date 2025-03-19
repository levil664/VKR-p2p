import React from 'react';
import { BrowserRouter } from 'react-router';
import { AppRoutes } from './appRoutes';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
};

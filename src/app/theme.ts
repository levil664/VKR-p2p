import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    // primary: {
    //   main: '#1976d2',
    // },
    // background: {
    //   default: '#e3f2fd',
    // },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          borderBlockColor: '#fff',
          borderColor: '#fff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

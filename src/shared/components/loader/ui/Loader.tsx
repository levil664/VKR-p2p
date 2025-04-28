import { Box, CircularProgress, Typography } from '@mui/material';

export const Loader = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
    <Typography variant="h6" sx={{ mt: 2 }}>
      Загрузка...
    </Typography>
  </Box>
);

import { Box, Typography } from '@mui/material';

export const Mentoring = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, p: 3, gap: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Наставничество</Typography>
        </Box>
      </Box>
    </Box>
  );
};

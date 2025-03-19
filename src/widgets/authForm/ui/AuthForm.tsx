import React from 'react';
import { Box, Button, Link, TextField, Typography } from '@mui/material';

interface AuthFormProps {
  title: string;
  fields: { label: string; type: string }[];
  buttonText: string;
  links: { text: string; href: string }[];
}

export const AuthForm: React.FC<AuthFormProps> = ({ title, fields, buttonText, links }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: { xs: '90%', sm: '80%', md: '400px' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          border: '1px solid #90caf9',
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2, color: '#1976d2' }}>
          {title}
        </Typography>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {fields.map((field, index) => (
            <TextField
              key={index}
              label={field.label}
              type={field.type}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          ))}
          <Button variant="contained" fullWidth color="primary" sx={{ marginTop: 2 }}>
            {buttonText}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ marginTop: 2, color: '#757575' }}>
          {links.map((link, index) => (
            <React.Fragment key={index}>
              <Link href={link.href} underline="hover" sx={{ color: '#1976d2', mr: 1 }}>
                {link.text}
              </Link>
              {index < links.length - 1 && ' '}
            </React.Fragment>
          ))}
        </Typography>
      </Box>
    </Box>
  );
};

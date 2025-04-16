import { Box, Button, Link, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'universal-cookie';
import { useLoginMutation } from '../../../entities/auth/api/authApi';
import { LoginRequest } from '../../../entities/auth/model';
import { useMeQuery } from '../../../entities/user/api/userApi';

interface AuthFormProps {
  title: string;
  fields: { label: string; type: string; name: string }[];
  buttonText: string;
  links: { text: string; href: string }[];
}

export const AuthForm: React.FC<AuthFormProps> = ({ title, fields, buttonText, links }) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const { refetch } = useMeQuery();
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(formData as LoginRequest).unwrap();
      await refetch();
      const cookies = new Cookies();
      cookies.set('jwtToken', response.data.accessToken, { path: '/' });
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

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
          component="form"
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
          onSubmit={handleSubmit}
        >
          {fields.map((field, index) => (
            <TextField
              key={index}
              label={field.label}
              type={field.type}
              name={field.name}
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleInputChange}
            />
          ))}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            sx={{ marginTop: 2 }}
            disabled={isLoading}
          >
            {buttonText}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ marginTop: 2, color: '#757575' }}>
          {links.map((link, index) => (
            <React.Fragment key={index}>
              <Link
                component="button"
                onClick={() => navigate(link.href)}
                underline="hover"
                sx={{ color: '#1976d2', mr: 1 }}
              >
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

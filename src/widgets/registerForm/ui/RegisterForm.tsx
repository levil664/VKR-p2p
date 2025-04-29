import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useRegisterMutation } from '../../../entities/auth/api/authApi';

interface RegisterFormProps {
  title: string;
  buttonText: string;
  links: { text: string; href: string }[];
  onSuccess: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  title,
  buttonText,
  links,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    middleName: '',
    university: '',
    faculty: '',
    course: 1,
    password: '',
  });
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.username) newErrors.username = 'Имя обязательно';
    else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      newErrors.username = 'Имя может содержать только английские буквы и цифры';
    }
    if (!formData.email) newErrors.email = 'Email обязателен';
    if (!formData.firstName) newErrors.firstName = 'Имя обязательно';
    if (!formData.lastName) newErrors.lastName = 'Фамилия обязательна';
    if (!formData.middleName) newErrors.middleName = 'Отчество обязательно';
    if (!formData.university) newErrors.university = 'Университет обязателен';
    if (!formData.faculty) newErrors.faculty = 'Факультет обязателен';
    if (formData.course < 1 || formData.course > 6) newErrors.course = 'Курс должен быть от 1 до 6';
    if (!formData.password) newErrors.password = 'Пароль обязателен';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await register(formData).unwrap();
      toast.success('Регистрация прошла успешно!');
      onSuccess();
      navigate('/');
    } catch (err) {
      toast.error('Ошибка регистрации');
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
        maxWidth: { xs: '90%', sm: '80%', md: '600px' },
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
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <TextField
              label="Логин"
              type="text"
              name="username"
              variant="outlined"
              fullWidth
              onChange={handleInputChange}
              error={!!errors.username}
              helperText={errors.username}
            />
            <TextField
              label="Email"
              type="email"
              name="email"
              variant="outlined"
              fullWidth
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <TextField
              label="Имя"
              type="text"
              name="firstName"
              variant="outlined"
              fullWidth
              onChange={handleInputChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
            <TextField
              label="Фамилия"
              type="text"
              name="lastName"
              variant="outlined"
              fullWidth
              onChange={handleInputChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Box>

          <TextField
            label="Отчество"
            type="text"
            name="middleName"
            variant="outlined"
            fullWidth
            onChange={handleInputChange}
            error={!!errors.middleName}
            helperText={errors.middleName}
          />

          <TextField
            label="Университет"
            type="text"
            name="university"
            variant="outlined"
            fullWidth
            onChange={handleInputChange}
            error={!!errors.university}
            helperText={errors.university}
          />

          <TextField
            label="Факультет"
            type="text"
            name="faculty"
            variant="outlined"
            fullWidth
            onChange={handleInputChange}
            error={!!errors.faculty}
            helperText={errors.faculty}
          />

          <FormControl fullWidth error={!!errors.course}>
            <InputLabel id="course-label">Курс</InputLabel>
            <Select
              labelId="course-label"
              name="course"
              value={formData.course}
              onChange={e =>
                handleInputChange({ target: { name: 'course', value: e.target.value } })
              }
            >
              {[1, 2, 3, 4, 5, 6].map(course => (
                <MenuItem key={course} value={course}>
                  {course} курс
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.course}</FormHelperText>
          </FormControl>

          <TextField
            label="Пароль"
            type="password"
            name="password"
            variant="outlined"
            fullWidth
            onChange={handleInputChange}
            error={!!errors.password}
            helperText={errors.password}
          />

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

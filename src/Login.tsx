import React, { useState } from "react";
import { TextField, Button, Typography, Box, Link } from "@mui/material";
import { useNavigate } from "react-router";
import LockIcon from "@mui/icons-material/Lock";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Logged in:", { email, password });
    navigate("/");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5", // Задний фон
        border: "2px solid #1976d2", // Бордер
        borderRadius: "8px",
        padding: "20px",
        width: "360px",
        boxShadow: 3,
        position: "absolute", // Позиционируем форму абсолютно
        top: "40%", // Центрируем по вертикали
        left: "50%", // Центрируем по горизонтали
        transform: "translate(-40%, -50%)", // Сдвигаем на половину ширины и высоты
      }}
    >
      <Typography variant="h5">Вход</Typography>
      <LockIcon sx={{ fontSize: 40, mb: 2 }} /> {/* Иконка */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Пароль"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Войти
      </Button>
      <Link href="/register" variant="body2">
        У вас нет аккаунта? Зарегистрируйтесь
      </Link>
    </Box>
  );
};

export default Login;

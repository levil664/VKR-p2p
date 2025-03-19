import React from 'react';
import { Login, Register } from '../../pages/auth/ui';
import { Route, Routes } from 'react-router';
import { NotFound } from '../../pages/notFound/ui';
import { MainLayout } from '../../features/mainLayout/ui/MainLayout';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<></>} />
        {/* Добавьте другие дочерние маршруты здесь */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Route>
    </Routes>
  );
};

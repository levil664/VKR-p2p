import React from 'react';
import { Route, Routes } from 'react-router';
import { MainLayout } from '../../features/mainLayout/ui/MainLayout';
import { Applications } from '../../pages/applications/ui';
import { Login, Register } from '../../pages/auth/ui';
import { MyApplications } from '../../pages/myApplications/ui';
import { NotFound } from '../../pages/notFound/ui';
import { Profile } from '../../pages/profile/ui';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Applications />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

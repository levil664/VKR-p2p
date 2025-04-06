import React from 'react';
import { Route, Routes } from 'react-router';
import { MainLayout } from '../../features/mainLayout/ui/MainLayout';
import { Advert } from '../../pages/advert/ui';
import { Login, Register } from '../../pages/auth/ui';
import { Mentoring } from '../../pages/mentoring/ui/Mentoring';
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
        <Route path="/" element={<Advert />} />
        <Route path="/advert" element={<Advert />} />
        <Route path="/my-adverts" element={<MyApplications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mentoring" element={<Mentoring />} />
      </Route>
    </Routes>
  );
};

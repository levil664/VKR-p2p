import React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { MainLayout } from '../../features/mainLayout/ui/MainLayout';
import { Advert } from '../../pages/advert/ui';
import { Login, Register } from '../../pages/auth/ui';
import { MentorApplication } from '../../pages/mentorApplication/ui';
import { MyAdverts } from '../../pages/myAdvert/ui/MyAdvert';
import { NotFound } from '../../pages/notFound/ui';
import { Profile } from '../../pages/profile/ui';
import { useAppSelector } from '../api';

export const AppRoutes: React.FC = () => {
  const userRole = useAppSelector(state => state.user.role);

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />

      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={userRole === 'ROLE_TEACHER' ? <MentorApplication /> : <Advert />}
        />
        <Route
          path="/advert"
          element={userRole === 'ROLE_TEACHER' ? <MentorApplication /> : <Advert />}
        />

        <Route
          path="/my-adverts"
          element={
            !userRole ? (
              <Navigate to="/login" />
            ) : userRole === 'ROLE_TEACHER' ? (
              <NotFound />
            ) : (
              <MyAdverts />
            )
          }
        />

        <Route path="/profile" element={!userRole ? <Navigate to="/login" /> : <Profile />} />
      </Route>
    </Routes>
  );
};

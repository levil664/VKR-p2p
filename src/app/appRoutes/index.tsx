import React from 'react';
import { Route, Routes } from 'react-router';
import { RoleEnum } from '../../entities/user/model/enums';
import { MainLayout } from '../../features/mainLayout/ui/MainLayout';
import { AdvertDetailPage } from '../../pages/advert/id/ui/AdvertDetailPage';
import { Advert } from '../../pages/advert/ui';
import { Login, Register } from '../../pages/auth/ui';
import { MentorApplication } from '../../pages/mentorApplication/ui';
import { MyAdverts } from '../../pages/myAdvert/ui/MyAdvert';
import { MyAdvertResponses } from '../../pages/myAdvertResponse/ui/MyAdvertResponse';
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
          element={userRole === RoleEnum.TEACHER ? <MentorApplication /> : <Advert />}
        />

        <Route
          path="/advert"
          element={userRole === RoleEnum.TEACHER ? <MentorApplication /> : <Advert />}
        />

        <Route
          path="/my-response"
          element={userRole === RoleEnum.TEACHER ? <NotFound /> : <MyAdvertResponses />}
        />

        <Route
          path="/my-advert"
          element={userRole === RoleEnum.TEACHER ? <NotFound /> : <MyAdverts />}
        />

        <Route path="/profile" element={<Profile />} />

        <Route
          path="/advert/:id"
          element={userRole === RoleEnum.TEACHER ? <NotFound /> : <AdvertDetailPage />}
        />
      </Route>
    </Routes>
  );
};

import Cookies from 'universal-cookie';
import { commonApi } from '../../../app/api';
import { EmptyResponse } from '../../../shared/model';
import { ItemResponseUserDto } from '../../user/model/types';
import { ItemResponseAuthToken, LoginRequest, RefreshRequest, RegistrationRequest } from '../model';

const cookies = new Cookies();

export const authApi = commonApi.injectEndpoints?.({
  endpoints: builder => ({
    register: builder.mutation<ItemResponseUserDto, RegistrationRequest>({
      query: body => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<ItemResponseAuthToken, LoginRequest>({
      query: body => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ItemResponseAuthToken) => {
        const { accessToken, refreshToken } = response.data;
        cookies.set('jwtToken', accessToken, { path: '/' });
        cookies.set('refreshToken', refreshToken, { path: '/' });
        return response;
      },
    }),
    refresh: builder.mutation<ItemResponseAuthToken, RefreshRequest>({
      query: body => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ItemResponseAuthToken) => {
        const { accessToken, refreshToken } = response.data;
        cookies.set('jwtToken', accessToken, { path: '/' });
        cookies.set('refreshToken', refreshToken, { path: '/' });
        return response;
      },
    }),
    logout: builder.mutation<EmptyResponse, RefreshRequest>({
      query: body => ({
        url: '/auth/logout',
        method: 'POST',
        body,
      }),
      onQueryStarted: async (_, { dispatch }) => {
        cookies.remove('jwtToken', { path: '/' });
        cookies.remove('refreshToken', { path: '/' });
      },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useRefreshMutation, useLogoutMutation } =
  authApi;

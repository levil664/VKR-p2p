import { commonApi } from '../../../app/api';
import { EmptyResponse } from '../../../shared/model';
import { ItemResponseUserDto } from '../../user/model/userModel';
import { ItemResponseAuthToken, LoginRequest, RefreshRequest, RegistrationRequest } from '../model';

export const authApi = commonApi.injectEndpoints?.({
  endpoints: builder => ({
    register: builder.mutation<ItemResponseUserDto, RegistrationRequest>({
      query: body => ({
        url: '/api/v1/auth/register',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<ItemResponseAuthToken, LoginRequest>({
      query: body => ({
        url: '/api/v1/auth/login',
        method: 'POST',
        body,
      }),
    }),
    refresh: builder.mutation<ItemResponseAuthToken, RefreshRequest>({
      query: body => ({
        url: '/api/v1/auth/refresh',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<EmptyResponse, RefreshRequest>({
      query: body => ({
        url: '/api/v1/auth/logout',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useRefreshMutation, useLogoutMutation } =
  authApi;

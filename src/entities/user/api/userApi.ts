import { commonApi } from '../../../app/api';
import { ItemResponseUserDto, ItemResponseUserProfileDto, UpdateProfileRequest } from '../model';

export const userApi = commonApi.injectEndpoints?.({
  endpoints: builder => ({
    me: builder.query<ItemResponseUserDto, void>({
      query: () => ({
        url: '/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    editProfile: builder.mutation<ItemResponseUserDto, UpdateProfileRequest>({
      query: body => ({
        url: '/me',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    getUser: builder.query<ItemResponseUserProfileDto, string>({
      query: id => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const { useMeQuery, useEditProfileMutation, useGetUserQuery } = userApi;

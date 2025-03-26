import { commonApi } from '../../../app/api';
import { ItemResponseUserDto } from '../model/userModel';

export const userApi = commonApi.injectEndpoints?.({
  endpoints: builder => ({
    me: builder.query<ItemResponseUserDto, void>({
      query: () => ({
        url: '/api/v1/me',
        method: 'GET',
      }),
    }),
  }),
});

export const { useMeQuery } = userApi;

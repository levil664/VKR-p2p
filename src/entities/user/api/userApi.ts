import { commonApi } from '../../../app/api';
import { ItemResponseUserDto } from '../model';

export const userApi = commonApi.injectEndpoints?.({
  endpoints: builder => ({
    me: builder.query<ItemResponseUserDto, void>({
      query: () => ({
        url: '/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const { useMeQuery } = userApi;

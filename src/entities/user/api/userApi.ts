import { commonApi } from '../../../app/api';
import { ItemResponseUserDto } from '../model';

export const userApi = commonApi.injectEndpoints?.({
  endpoints: builder => ({
    me: builder.query<ItemResponseUserDto, void>({
      query: () => ({
        url: '/me',
        method: 'GET',
      }),
    }),
  }),
});

export const { useMeQuery } = userApi;

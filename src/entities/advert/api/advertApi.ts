import { commonApi } from '../../../app/api';
import { EmptyResponse } from '../../../shared/model';
import {
  CreateAdvertRequest,
  ItemResponseAdvertDto,
  ListResponseAdvertDto,
  PageResponseAdvertDto,
  UpdateAdvertRequest,
} from '../model';

export const advertApi = commonApi.injectEndpoints?.({
  endpoints: builder => ({
    getAdverts: builder.query<
      PageResponseAdvertDto,
      {
        query?: string;
        type?: string;
        pageNumber?: number;
        pageSize?: number;
      }
    >({
      query: params => ({
        url: '/adverts',
        method: 'GET',
        params,
      }),
      providesTags: result =>
        result && result.data && result.data.content
          ? [
              ...result.data.content.map(({ id }) => ({ type: 'Advert', id })),
              { type: 'Advert', id: 'LIST' },
            ]
          : [{ type: 'Advert', id: 'LIST' }],
    }),
    finalizeAdvert: builder.mutation<ItemResponseAdvertDto, string>({
      query: id => ({
        url: `/adverts/${id}/finalize`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Advert', id }],
    }),
    createAdvert: builder.mutation<ItemResponseAdvertDto, CreateAdvertRequest>({
      query: body => ({
        url: '/adverts',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Advert', id: 'LIST' }],
    }),
    getAdvert: builder.query<ItemResponseAdvertDto, string>({
      query: id => ({
        url: `/adverts/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Advert', id }],
    }),
    deleteAdvert: builder.mutation<EmptyResponse, string>({
      query: id => ({
        url: `/adverts/${id}`,
        method: 'DELETE',
      }),
    }),
    updateAdvert: builder.mutation<
      ItemResponseAdvertDto,
      { id: string; body: UpdateAdvertRequest }
    >({
      query: ({ id, body }) => ({
        url: `/adverts/${id}`,
        method: 'PATCH',
        body,
      }),
    }),
    getMyAdverts: builder.query<ListResponseAdvertDto, void>({
      query: () => ({
        url: '/me/adverts',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetAdvertsQuery,
  useCreateAdvertMutation,
  useGetAdvertQuery,
  useDeleteAdvertMutation,
  useUpdateAdvertMutation,
  useGetMyAdvertsQuery,
  useFinalizeAdvertMutation,
} = advertApi;

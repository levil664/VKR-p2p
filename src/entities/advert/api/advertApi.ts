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
        url: '/api/v1/adverts',
        method: 'GET',
        params,
      }),
    }),
    createAdvert: builder.mutation<ItemResponseAdvertDto, CreateAdvertRequest>({
      query: body => ({
        url: '/api/v1/adverts',
        method: 'POST',
        body,
      }),
    }),
    getAdvert: builder.query<ItemResponseAdvertDto, string>({
      query: id => ({
        url: `/api/v1/adverts/${id}`,
        method: 'GET',
      }),
    }),
    deleteAdvert: builder.mutation<EmptyResponse, string>({
      query: id => ({
        url: `/api/v1/adverts/${id}`,
        method: 'DELETE',
      }),
    }),
    updateAdvert: builder.mutation<
      ItemResponseAdvertDto,
      { id: string; body: UpdateAdvertRequest }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/adverts/${id}`,
        method: 'PATCH',
        body,
      }),
    }),
    getMyAdverts: builder.query<ListResponseAdvertDto, void>({
      query: () => ({
        url: '/api/v1/me/adverts',
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
} = advertApi;

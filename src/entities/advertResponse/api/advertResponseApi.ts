import { commonApi } from '../../../app/api';
import {
  CreateAdvertResponseRequest,
  ItemResponseAdvertResponseDto,
  ListResponseAdvertResponseDto,
  ListResponseAdvertWithResponseDto,
} from '../model';
import { EmptyResponse } from '../../chat/model';

export const advertResponseApi = commonApi.injectEndpoints?.({
  endpoints: builder => ({
    getAdvertResponses: builder.query<ListResponseAdvertResponseDto, string>({
      query: advertId => ({
        url: `/adverts/${advertId}/responses`,
        method: 'GET',
      }),
      providesTags: (result, error, advertId) =>
        result ? [{ type: 'AdvertResponse', id: advertId }] : [],
    }),
    createAdvertResponse: builder.mutation<
      ItemResponseAdvertResponseDto,
      {
        advertId: string;
        body: CreateAdvertResponseRequest;
      }
    >({
      query: ({ advertId, body }) => ({
        url: `/adverts/${advertId}/responses`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { advertId }) => [{ type: 'AdvertResponse', id: advertId }],
    }),
    acceptAdvertResponse: builder.mutation<
      ItemResponseAdvertResponseDto,
      { advertId: string; responseId: string }
    >({
      query: ({ advertId, responseId }) => ({
        url: `/adverts/${advertId}/responses/${responseId}/accept`,
        method: 'POST',
      }),
    }),
    getMyAdvertResponses: builder.query<ListResponseAdvertWithResponseDto, void>({
      query: () => ({
        url: '/me/adverts/responses',
        method: 'GET',
      }),
    }),
    getAdvertResponse: builder.query<
      ItemResponseAdvertResponseDto,
      { advertId: string; responseId: string }
    >({
      query: ({ advertId, responseId }) => ({
        url: `/adverts/${advertId}/responses/${responseId}`,
        method: 'GET',
      }),
    }),
    deleteAdvertResponse: builder.mutation<EmptyResponse, { advertId: string; responseId: string }>(
      {
        query: ({ advertId, responseId }) => ({
          url: `/adverts/${advertId}/responses/${responseId}`,
          method: 'DELETE',
        }),
      }
    ),
  }),
});

export const {
  useGetAdvertResponsesQuery,
  useCreateAdvertResponseMutation,
  useAcceptAdvertResponseMutation,
  useGetMyAdvertResponsesQuery,
  useGetAdvertResponseQuery,
  useDeleteAdvertResponseMutation,
} = advertResponseApi;

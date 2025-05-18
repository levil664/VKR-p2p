import { commonApi } from '../../../app/api';
import {
  CreateReviewRequest,
  ItemResponseReviewDto,
  ListResponseAdvertsWithoutReviewDto,
  ListResponseReviewDto,
} from '../model';

export const reviewApi = commonApi.injectEndpoints?.({
  endpoints: builder => ({
    createReview: builder.mutation<
      ItemResponseReviewDto,
      { advertId: string; body: CreateReviewRequest }
    >({
      query: ({ advertId, body }) => ({
        url: `/adverts/${advertId}/reviews`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Review', id: 'LIST' }],
    }),
    getReviewsForUser: builder.query<
      ListResponseReviewDto,
      { userId: string; type?: 'MENTOR' | 'STUDENT' }
    >({
      query: ({ userId, type }) => ({
        url: `/users/${userId}/reviews`,
        method: 'GET',
        params: { type },
      }),
      providesTags: result =>
        result && result.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Review', id })),
              { type: 'Review', id: 'LIST' },
            ]
          : [{ type: 'Review', id: 'LIST' }],
    }),
    getReview: builder.query<ItemResponseReviewDto, string>({
      query: reviewId => ({
        url: `/reviews/${reviewId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Review', id }],
    }),
    deleteReview: builder.mutation<ItemResponseReviewDto, string>({
      query: reviewId => ({
        url: `/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Review', id }],
    }),
    getReviewsForAdvert: builder.query<ListResponseReviewDto, string>({
      query: advertId => ({
        url: `/adverts/${advertId}/reviews`,
        method: 'GET',
      }),
      providesTags: result =>
        result && result.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Review', id })),
              { type: 'Review', id: 'LIST' },
            ]
          : [{ type: 'Review', id: 'LIST' }],
    }),
    getAdvertsWithoutReview: builder.query<ListResponseAdvertsWithoutReviewDto, void>({
      query: () => ({
        url: `/me/adverts/without-review`,
        method: 'GET',
      }),
      providesTags: result =>
        result && result.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Review', id })),
              { type: 'Review', id: 'LIST' },
            ]
          : [{ type: 'Review', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetReviewsForUserQuery,
  useGetReviewQuery,
  useDeleteReviewMutation,
  useGetReviewsForAdvertQuery,
  useGetAdvertsWithoutReviewQuery,
} = reviewApi;

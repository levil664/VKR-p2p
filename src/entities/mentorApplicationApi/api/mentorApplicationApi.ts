import { commonApi } from '../../../app/api';
import {
  ItemResponseMentorApplicationDto,
  ListResponseMentorApplicationDto,
  MentorApplyRequest,
} from '../model/types';

export const mentorApplicationApi = commonApi.injectEndpoints?.({
  endpoints: builder => ({
    getMentorApplications: builder.query<ListResponseMentorApplicationDto, { state: string }>({
      query: params => ({
        url: '/mentor-applications',
        method: 'GET',
        params,
      }),
      providesTags: result =>
        result && result.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'MentorApplication', id })),
              { type: 'MentorApplication', id: 'LIST' },
            ]
          : [{ type: 'MentorApplication', id: 'LIST' }],
    }),
    applyForMentor: builder.mutation<ItemResponseMentorApplicationDto, MentorApplyRequest>({
      query: body => ({
        url: '/mentor-applications',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'MentorApplication', id: 'LIST' }],
    }),
    rejectMentorApplication: builder.mutation<ItemResponseMentorApplicationDto, string>({
      query: id => ({
        url: `/mentor-applications/${id}/reject`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'MentorApplication', id }],
    }),
    approveMentorApplication: builder.mutation<ItemResponseMentorApplicationDto, string>({
      query: id => ({
        url: `/mentor-applications/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'MentorApplication', id }],
    }),
  }),
});

export const {
  useGetMentorApplicationsQuery,
  useApplyForMentorMutation,
  useRejectMentorApplicationMutation,
  useApproveMentorApplicationMutation,
} = mentorApplicationApi;

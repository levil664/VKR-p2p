import { commonApi } from '../../../app/api';
import {
  CreateGroupMeetingRequest,
  EmptyResponse,
  ItemResponseGroupMeetingDto,
  ItemResponseString,
  ListResponseGroupMeetingDto,
  PageResponseGroupMeetingDto,
} from '../model';

export const groupMeetingApi = commonApi.injectEndpoints?.({
  endpoints: builder => ({
    getGroupMeetings: builder.query<
      PageResponseGroupMeetingDto,
      { pageNumber?: number; pageSize?: number }
    >({
      query: ({ pageNumber, pageSize }) => ({
        url: '/group-meetings',
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
    }),
    createGroupMeeting: builder.mutation<ItemResponseGroupMeetingDto, CreateGroupMeetingRequest>({
      query: body => ({
        url: '/group-meetings',
        method: 'POST',
        body,
      }),
    }),
    getGroupMeeting: builder.query<ItemResponseGroupMeetingDto, string>({
      query: id => ({
        url: `/group-meetings/${id}`,
        method: 'GET',
      }),
    }),
    updateGroupMeeting: builder.mutation<
      ItemResponseGroupMeetingDto,
      { id: string; body: CreateGroupMeetingRequest }
    >({
      query: ({ id, body }) => ({
        url: `/group-meetings/${id}`,
        method: 'PATCH',
        body,
      }),
    }),
    deleteGroupMeeting: builder.mutation<EmptyResponse, string>({
      query: id => ({
        url: `/group-meetings/${id}`,
        method: 'DELETE',
      }),
    }),
    getMyGroupMeetings: builder.query<ListResponseGroupMeetingDto, void>({
      query: () => ({
        url: '/me/group-meetings',
        method: 'GET',
      }),
    }),
    getGroupMeetingUrl: builder.query<ItemResponseString, string>({
      query: id => ({
        url: `/group-meetings/${id}/url`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetGroupMeetingsQuery,
  useCreateGroupMeetingMutation,
  useGetGroupMeetingQuery,
  useUpdateGroupMeetingMutation,
  useDeleteGroupMeetingMutation,
  useGetMyGroupMeetingsQuery,
  useGetGroupMeetingUrlQuery,
} = groupMeetingApi;

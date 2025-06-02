import { groupMeetingApi } from './groupMeetings';

export const {
  useGetGroupMeetingsQuery,
  useCreateGroupMeetingMutation,
  useGetGroupMeetingQuery,
  useUpdateGroupMeetingMutation,
  useDeleteGroupMeetingMutation,
  useGetMyGroupMeetingsQuery,
  useGetGroupMeetingUrlQuery,
  useAttendGroupMeetingMutation,
  useUnattendGroupMeetingMutation,
} = groupMeetingApi;

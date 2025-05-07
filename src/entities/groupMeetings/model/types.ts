import { PageableObject, SortObject, UserPublicDto } from '../../advert/model';

export interface CreateGroupMeetingRequest {
  title: string;
  description: string;
  startDt: string;
  startTime: string;
  endDt: string;
  endTime: string;
}

export interface GroupMeetingDto {
  id: string;
  creator: UserPublicDto;
  title: string;
  description: string;
  startDt: string;
  endDt: string;
  createdOn: string;
}

export interface ItemResponseGroupMeetingDto {
  data: GroupMeetingDto;
  status: number;
  message?: string;
}

export interface ListResponseGroupMeetingDto {
  data: GroupMeetingDto[];
  status: number;
  message?: string;
}

export interface PageResponseGroupMeetingDto {
  data: PageGroupMeetingDto;
  status: number;
  message?: string;
}

export interface PageGroupMeetingDto {
  totalElements: number;
  totalPages: number;
  pageable: PageableObject;
  numberOfElements: number;
  content: GroupMeetingDto[];
  pageNumber: number;
  pageSize: number;
  sort: SortObject;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface EmptyResponse {
  status: number;
  message?: string;
}

export interface ItemResponseString {
  data: string;
  status: number;
  message?: string;
}

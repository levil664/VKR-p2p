import { PageableObject, SortObject, UserPublicDto } from '../../advert/model';
import { ChatTypeEnum, MessageTypeEnum } from './enums';

export interface SendMessageRequest {
  text: string;
}

export interface ChatMessageDto {
  id: string;
  senderId: string;
  type: MessageTypeEnum;
  content: UserMessageContent | VideoChatCreatedMessageContent;
  createdOn: string;
}

export interface UserMessageContent {
  text: string;
}

export interface VideoChatCreatedMessageContent {
  meetingId: string;
  meetingName: string;
  starterUserId: string;
}

export interface ItemResponseChatMessageDto {
  data: ChatMessageDto;
  status: number;
  message?: string;
}

export interface ListResponseChatMessageDto {
  data: ChatMessageDto[];
  status: number;
  message?: string;
}

export interface PageResponseChatMessageDto {
  data: PageChatMessageDto;
  status: number;
  message?: string;
}

export interface PageChatMessageDto {
  totalElements: number;
  totalPages: number;
  pageable: PageableObject;
  numberOfElements: number;
  content: ChatMessageDto[];
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

export interface ChatDto {
  id: string;
  type: ChatTypeEnum;
  participants: UserPublicDto[];
  advertId?: string;
  advertResponseId?: string;
}

export interface ItemResponseChatDto {
  data: ChatDto;
  status: number;
  message?: string;
}

export interface ListResponseChatDto {
  data: ChatDto[];
  status: number;
  message?: string;
}

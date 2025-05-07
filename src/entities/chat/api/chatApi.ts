import { commonApi } from '../../../app/api';
import {
  EmptyResponse,
  ItemResponseChatDto,
  ItemResponseChatMessageDto,
  ListResponseChatDto,
  ListResponseChatMessageDto,
  PageResponseChatMessageDto,
  SendMessageRequest,
} from '../model';

export const chatApi = commonApi.injectEndpoints?.({
  endpoints: builder => ({
    createVideoCall: builder.mutation<ItemResponseChatMessageDto, { chatId: string }>({
      query: ({ chatId }) => ({
        url: `/chats/${chatId}/videoCall`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'ChatMessage', id: 'LIST' }],
    }),
    getMessages: builder.query<
      PageResponseChatMessageDto,
      {
        chatId: string;
        pageNumber?: number;
        pageSize?: number;
      }
    >({
      query: ({ chatId, pageNumber, pageSize }) => ({
        url: `/chats/${chatId}/messages`,
        method: 'GET',
        params: { pageNumber, pageSize },
      }),
      providesTags: result =>
        result && result.data && result.data.content
          ? [
              ...result.data.content.map(({ id }) => ({ type: 'ChatMessage', id })),
              { type: 'ChatMessage', id: 'LIST' },
            ]
          : [{ type: 'ChatMessage', id: 'LIST' }],
    }),
    sendMessage: builder.mutation<
      ItemResponseChatMessageDto,
      { chatId: string; body: SendMessageRequest }
    >({
      query: ({ chatId, body }) => ({
        url: `/chats/${chatId}/messages`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'ChatMessage', id: 'LIST' }],
    }),
    markRead: builder.mutation<EmptyResponse, { chatId: string; messageId: string }>({
      query: ({ chatId, messageId }) => ({
        url: `/chats/${chatId}/messages/markRead?messageId=${messageId}`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'ChatMessage', id: 'LIST' }],
    }),
    getUnreadMessages: builder.query<ListResponseChatMessageDto, string>({
      query: chatId => ({
        url: `/chats/${chatId}/messages/unread`,
        method: 'GET',
      }),
    }),
    getChat: builder.query<ItemResponseChatDto, string>({
      query: id => ({
        url: `/chats/${id}`,
        method: 'GET',
      }),
    }),
    getMyChats: builder.query<ListResponseChatDto, void>({
      query: () => ({
        url: '/me/chats',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useCreateVideoCallMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkReadMutation,
  useGetUnreadMessagesQuery,
  useGetChatQuery,
  useGetMyChatsQuery,
} = chatApi;

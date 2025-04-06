import { createApi, fetchBaseQuery, FetchBaseQueryMeta } from '@reduxjs/toolkit/query/react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Slices } from '../model/types';

const cookies = new Cookies();

export interface ErrorType {
  data: {
    error: {
      code: string;
      message?: string;
      violation_fields?: any;
      violations?: string[];
    };
  };
  status: number;
}

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8080',
  credentials: 'include',
  prepareHeaders: headers => {
    const csrfToken = cookies.get('csrftoken');
    if (csrfToken) {
      headers.set('X-CSRFToken', csrfToken);
    }
    const jwtToken = cookies.get('jwtToken');
    if (jwtToken) {
      headers.set('Authorization', `Bearer ${jwtToken}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth: (
  args,
  api,
  extraOptions
) => Promise<
  | {
      error:
        | { status: number; data: unknown }
        | { status: 'FETCH_ERROR'; data?: undefined; error: string }
        | {
            status: 'PARSING_ERROR';
            originalStatus: number;
            data: string;
            error: string;
          }
        | { status: 'TIMEOUT_ERROR'; data?: undefined; error: string }
        | {
            status: 'CUSTOM_ERROR';
            data?: unknown;
            error: string;
          };
      data?: undefined;
      meta?: FetchBaseQueryMeta;
    }
  | { error?: undefined; data: unknown; meta?: FetchBaseQueryMeta }
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error && result?.error.status === 401) {
    try {
      const refreshToken = cookies.get('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const refreshResponse = await axios.post(
        `${import.meta.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8080'}/api/v1/auth/refresh`,
        { refreshToken }
      );

      const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

      cookies.set('jwtToken', accessToken);
      cookies.set('refreshToken', newRefreshToken);

      result = await baseQuery(args, api, extraOptions);
    } catch (error) {
      cookies.remove('jwtToken');
      cookies.remove('refreshToken');
      window.location.href = '/login';
    }
  }

  return result;
};

export const commonApi = createApi({
  reducerPath: Slices.Api,
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Deals', 'FavoriteDeals', 'User'],
  endpoints: builder => ({}),
});

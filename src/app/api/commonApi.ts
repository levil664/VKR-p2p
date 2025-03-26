import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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

export const commonApi = createApi({
  reducerPath: Slices.Api,
  baseQuery: fetchBaseQuery({
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
  }) as BaseQueryFn<string | FetchArgs, unknown, ErrorType, {}>,
  tagTypes: ['Deals', 'FavoriteDeals', 'User'],
  endpoints: builder => ({}),
});

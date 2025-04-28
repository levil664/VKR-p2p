import { commonApi } from '../../../app/api';
import { SubjectWithTopicsDto } from '../model/types';

export const subjectsApi = commonApi.injectEndpoints?.({
  endpoints: builder => ({
    getSubjects: builder.query<SubjectWithTopicsDto, void>({
      query: () => ({
        url: '/subjects',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetSubjectsQuery } = subjectsApi;

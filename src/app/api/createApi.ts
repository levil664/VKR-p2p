import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const createApi = (): AxiosInstance => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8080',
    timeout: 5000,
  });

  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const csrfToken = cookies.get('csrftoken');
    if (csrfToken && config.headers) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  });

  return api;
};

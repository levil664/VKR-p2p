import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { commonApi } from './commonApi';
import { ErrorMiddleware } from './errorMiddleware';
import { rootReducer } from './reducer';

const middleware = (getDefaultMiddleware: any) =>
  getDefaultMiddleware().concat([commonApi.middleware, ErrorMiddleware]);

export const store = configureStore({
  reducer: rootReducer,
  middleware,
});

setupListeners(store.dispatch as any);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;

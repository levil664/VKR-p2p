import { combineReducers } from '@reduxjs/toolkit';
import { commonApi } from './commonApi';
import userReducer from '../../entities/user/api/slice';

export const rootReducer = combineReducers({
  [commonApi.reducerPath]: commonApi.reducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

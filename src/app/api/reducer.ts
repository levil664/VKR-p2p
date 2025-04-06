import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '../../entities/user/api/slice';
import { commonApi } from './commonApi';

export const rootReducer = combineReducers({
  [commonApi.reducerPath]: commonApi.reducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

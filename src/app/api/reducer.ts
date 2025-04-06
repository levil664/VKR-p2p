import { combineReducers } from '@reduxjs/toolkit';
import { commonApi } from './commonApi';

export const rootReducer = combineReducers({
  [commonApi.reducerPath]: commonApi.reducer,
});

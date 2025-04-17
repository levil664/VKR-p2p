import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RoleEnum } from '../model/enums';

interface UserState {
  role: RoleEnum | null;
}

const initialState = {
  role: null as RoleEnum | RoleEnum[] | null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserRole(state, action: PayloadAction<RoleEnum>) {
      state.role = action.payload;
    },
  },
});

export const { setUserRole } = userSlice.actions;
export default userSlice.reducer;

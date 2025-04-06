import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from '../model';

interface UserState {
  role: UserRole | UserRole[];
}

const initialState: UserState = {
  role: UserRole.STUDENT,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserRole(state, action: PayloadAction<UserRole | UserRole[]>) {
      state.role = action.payload;
    },
  },
});

export const { setUserRole } = userSlice.actions;
export default userSlice.reducer;

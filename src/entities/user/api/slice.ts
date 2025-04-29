import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RoleEnum } from '../model/enums';

interface UserState {
  role: RoleEnum | null;
  isMentor: boolean;
}

const initialState: UserState = {
  role: null,
  isMentor: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserRole(state, action: PayloadAction<RoleEnum>) {
      state.role = action.payload;
    },
    setIsMentor(state, action: PayloadAction<boolean>) {
      state.isMentor = action.payload;
    },
  },
});

export const { setUserRole, setIsMentor } = userSlice.actions;
export default userSlice.reducer;

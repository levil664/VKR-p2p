import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RoleEnum } from '../model/enums';

interface UserState {
  role: RoleEnum | null;
  isMentor: boolean;
  id: string | null;
}

const initialState: UserState = {
  role: null,
  isMentor: false,
  id: null,
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
    setUserId(state, action: PayloadAction<string>) {
      state.id = action.payload;
    },
  },
});

export const { setUserRole, setIsMentor, setUserId } = userSlice.actions;
export default userSlice.reducer;

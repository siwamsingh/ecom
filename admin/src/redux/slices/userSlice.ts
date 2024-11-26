import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  user: {
    _id: number | null;
    username: string | null;
    phone_number: string | null;
    status: string | null;
    role: string | null;
  } | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState["user"]>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

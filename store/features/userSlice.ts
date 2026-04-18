import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  createdAt: string;
  updatedAt: string;
}

interface forThisPageUser extends User {
  image?: string;
  phoneNumber?: string;
  membership?: "Standard" | "Premium" | "VIP";
}

interface UserState {
  user: forThisPageUser | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<forThisPageUser>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<Partial<forThisPageUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;

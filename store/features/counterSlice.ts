import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
  lastUpdated: number;
}

const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

const initialState: CounterState = {
  value: 0,
  lastUpdated: Date.now(),
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
      state.lastUpdated = Date.now();
    },
    decrement: (state) => {
      state.value -= 1;
      state.lastUpdated = Date.now();
    },
    resetIfExpired: (state) => {
      if (Date.now() - state.lastUpdated > ONE_MONTH) {
        state.value = 0;
        state.lastUpdated = Date.now();
      }
    },
  },
});

export const { increment, decrement, resetIfExpired } = counterSlice.actions;
export default counterSlice.reducer;

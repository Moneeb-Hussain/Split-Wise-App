import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userAuthToken: false,
  },
  reducers: {
    setUserAuthToken: (state, action) => {
      state.userAuthToken = action.payload;
    },
  },
});

export const { setUserAuthToken } = authSlice.actions;
export default authSlice.reducer;

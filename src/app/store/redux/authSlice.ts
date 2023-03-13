import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: string;
}

const initialState: AuthState = {
  user: Math.random().toString().replace('0.', '')
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {}
})

// export const {} = authSlice.actions;
export default authSlice.reducer;

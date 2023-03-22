import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToolState {
  selectedTool: number;
}

const initialState: ToolState = {
  selectedTool: 0,
};

export const toolSlice = createSlice({
  name: 'tool',
  initialState,
  reducers: {
    setTool(state, action: PayloadAction<number>) {
      state.selectedTool = action.payload;
    },
  },
});

export const { setTool } = toolSlice.actions;
export default toolSlice.reducer;

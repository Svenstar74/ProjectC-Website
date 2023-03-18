import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  selectedNode: string;

  deletedEdgeSource: string;
  deletedEdgeTarget: string;
}

const initialState: UiState = {
  selectedNode: '',

  deletedEdgeSource: '',
  deletedEdgeTarget: '',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setDeletedEdge(state, action: PayloadAction<{ source: string; target: string }>) {
      state.deletedEdgeSource = action.payload.source;
      state.deletedEdgeTarget = action.payload.target;
    },
  },
});

export const { setDeletedEdge } = uiSlice.actions;
export default uiSlice.reducer;

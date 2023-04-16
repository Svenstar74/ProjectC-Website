import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClimateConceptNodesRepository } from '@svenstar74/business-logic';

interface ToolState {
  selectedTool: number;
  activeSelection: ClimateConceptNodesRepository.ClimateConceptNodeModel[];
  summaryNodesVisible: boolean;
}

const initialState: ToolState = {
  selectedTool: 0,
  activeSelection: [],
  summaryNodesVisible: true,
};

export const toolSlice = createSlice({
  name: 'tool',
  initialState,
  reducers: {
    setTool(state, action: PayloadAction<number>) {
      state.selectedTool = action.payload;
    },
    setActiveSelection(state, action: PayloadAction<any[]>) {
      state.activeSelection = action.payload;
    },
    setSummaryNodesVisible(state, action: PayloadAction<boolean>) {
      state.summaryNodesVisible = action.payload;
    },
  },
});

export const { setTool, setActiveSelection, setSummaryNodesVisible } = toolSlice.actions;
export default toolSlice.reducer;

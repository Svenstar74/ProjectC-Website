import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClimateConceptNodesRepository, SummaryNodesRepository } from '@svenstar74/business-logic';

type LastSelected = 'ClimateConceptNode' | 'SummaryNode' | 'Edge' | null

interface GraphState {
  lastSelected: LastSelected;
  selectedNode: string;
  selectedEdge: [string, string];
}

const initialState: GraphState = {
  lastSelected: null,
  selectedNode: '',
  selectedEdge: ['', ''],
};

export const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    setLastSelected(state, action: PayloadAction<{ lastSelected: LastSelected, data: string | [string, string] }>) {
      state.lastSelected = action.payload.lastSelected;
      if (action.payload.lastSelected === 'ClimateConceptNode') {
        state.selectedNode = action.payload.data as string;
      } else if (action.payload.lastSelected === 'SummaryNode') {
        state.selectedNode = action.payload.data as string;
      } else if (action.payload.lastSelected === 'Edge') {
        state.selectedEdge = action.payload.data as [string, string];
      }
    }
  },
});

export const {
  setLastSelected,
} = graphSlice.actions;

export default graphSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LastSelected = 'ClimateConceptNode' | 'SummaryNode' | 'Edge' | null

interface GraphState {
  lastSelected: LastSelected;
  selectedNode: string;
  selectedEdge: [string, string];
  hoveredNode: string;

  contributesToVisible: boolean;
  isAVisible: boolean;
  isEqualToVisible: boolean;
}

const initialState: GraphState = {
  lastSelected: null,
  selectedNode: '',
  selectedEdge: ['', ''],
  hoveredNode: '',
  contributesToVisible: true,
  isAVisible: true,
  isEqualToVisible: true,
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
    },
    setHoveredNode(state, action: PayloadAction<string>) {
      state.hoveredNode = action.payload;
    },
    setContributesToVisible(state, action: PayloadAction<boolean>) {
      state.contributesToVisible = action.payload;
    },
    setIsAVisible(state, action: PayloadAction<boolean>) {
      state.isAVisible = action.payload;
    },
    setIsEqualToVisible(state, action: PayloadAction<boolean>) {
      state.isEqualToVisible = action.payload;
    },
  },
});

export const {
  setLastSelected,
  setHoveredNode,
  setContributesToVisible,
  setIsAVisible,
  setIsEqualToVisible,
} = graphSlice.actions;

export default graphSlice.reducer;

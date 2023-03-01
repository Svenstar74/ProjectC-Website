import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface NodeAttributes {
  node: string;
  x: number;
  y: number;
  label: string;
  size: number;
}

interface GraphState {
  selectedNode: NodeAttributes | null;
}

const initialState: GraphState = {
  selectedNode: null
}

export const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    setSelectedNode: (state, action: PayloadAction<NodeAttributes>) => {
      state.selectedNode = action.payload;
    },
    clearSelectedNode: (state) => {
      state.selectedNode = null;
    },
  },
});

export const { setSelectedNode, clearSelectedNode } = graphSlice.actions;
export const selectGraph = (state: RootState) => state.graph.selectedNode;

export default graphSlice.reducer;

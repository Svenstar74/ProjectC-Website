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
  last: 'node' | 'edge';
  selectedNode: NodeAttributes | null;
  selectedEdge: string[];
}

const initialState: GraphState = {
  last: 'node',
  selectedNode: null,
  selectedEdge: []
}

export const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    setSelectedNode: (state, action: PayloadAction<NodeAttributes>) => {
      state.last = 'node';
      state.selectedNode = action.payload;
    },
    clearSelectedNode: (state) => {
      state.selectedNode = null;
    },

    setSelectedEdge: (state, action: PayloadAction<string[]>) => {
      if (action.payload.length === 2) {
        state.last = 'edge';
        state.selectedEdge = action.payload;
      }
    },
    clearSelectedEdge: (state) => {
      state.selectedEdge = [];
    }
  },
});

export const { setSelectedNode, clearSelectedNode, setSelectedEdge, clearSelectedEdge } = graphSlice.actions;
export const selectGraph = (state: RootState) => state.graph.selectedNode;

export default graphSlice.reducer;

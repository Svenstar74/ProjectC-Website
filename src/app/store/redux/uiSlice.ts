import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  showContextMenu: boolean;
  contextMenuOptions: string[];
  contextMenuPosition: number[];
  selectedNode: string;

  deletedEdgeSource: string,
  deletedEdgeTarget: string,
}

const initialState: UiState = {
  showContextMenu: false,
  contextMenuOptions: [],
  contextMenuPosition: [],
  selectedNode: '',
  
  deletedEdgeSource: '',
  deletedEdgeTarget: '',
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showContextMenu(state, action: PayloadAction<{showMenu: boolean, menuPosition: number[], options: string[], nodeId?: string, nodePosition?: number[]}>) {
      state.showContextMenu = action.payload.showMenu;
      state.contextMenuPosition = action.payload.menuPosition;
      
      if (action.payload.nodeId) {
        state.selectedNode = action.payload.nodeId;
      }

      state.contextMenuOptions = action.payload.options;
    },
    setDeletedEdge(state, action: PayloadAction<{source: string, target: string}>) {
      state.deletedEdgeSource = action.payload.source;
      state.deletedEdgeTarget= action.payload.target;
    },
    hideContextMenu(state) {
      state.showContextMenu = false;
    },
  }
})

export const {
  showContextMenu,
  hideContextMenu,
  setDeletedEdge,
} = uiSlice.actions;
export default uiSlice.reducer;

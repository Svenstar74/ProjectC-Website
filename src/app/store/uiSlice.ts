import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Menu {
  show: boolean;
  position?: number[];
  climateConceptId?: string;
}

interface UiState {
  showContextMenu: boolean;
  contextMenuOptions: string[];
  contextMenuPosition: number[];
  nodeToAdd: number[];
  selectedNode: string;

  deletedEdgeSource: string,
  deletedEdgeTarget: string,
  
  showNewNodeDialog: boolean;
  showNewEdgeDialog: boolean;
  showDelEdgeDialog: boolean;
}

const initialState: UiState = {
  showContextMenu: false,
  contextMenuOptions: [],
  contextMenuPosition: [],
  nodeToAdd: [],
  selectedNode: '',
  
  deletedEdgeSource: '',
  deletedEdgeTarget: '',
  
  showNewNodeDialog: false,
  showNewEdgeDialog: false,
  showDelEdgeDialog: false,
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
    showNewNodeDialog(state) {
      state.showNewNodeDialog = true;
    },
    hideNewNodeDialog(state) {
      state.showNewNodeDialog = false;
    },
    showNewEdgeDialog(state) {
      state.showNewEdgeDialog = true;
    },
    hideNewEdgeDialog(state) {
      state.showNewEdgeDialog = false;
    },
    showDelEdgeDialog(state) {
      state.showDelEdgeDialog = true;
    },
    hideDelEdgeDialog(state) {
      state.showDelEdgeDialog = false;
    },
  }
})

export const {
  showContextMenu,
  hideContextMenu,
  setDeletedEdge,
  showNewNodeDialog,
  hideNewNodeDialog,
  showNewEdgeDialog,
  hideNewEdgeDialog,
  showDelEdgeDialog,
  hideDelEdgeDialog,
} = uiSlice.actions;
export default uiSlice.reducer;

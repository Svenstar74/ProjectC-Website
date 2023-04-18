import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClimateConceptNodesRepository, SummaryNodesRepository } from '@svenstar74/business-logic';
import { RootState } from '../store';

interface DataState {
  allClimateConceptNodes: ClimateConceptNodesRepository.AggregatedClimateConceptNodeModel[];
  allSummaryNodes: SummaryNodesRepository.SummaryNodeModel[];
}

const initialState: DataState = {
  allClimateConceptNodes: [],
  allSummaryNodes: [],
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    initAllClimateConceptNodes: (state, action: PayloadAction<ClimateConceptNodesRepository.AggregatedClimateConceptNodeModel[]>) => {
      state.allClimateConceptNodes = action.payload;
    },
    initAllSummaryNodes: (state, action: PayloadAction<SummaryNodesRepository.SummaryNodeModel[]>) => {
      state.allSummaryNodes = action.payload;
    },
    
    //#region ClimateConcept Stuff
    addClimateConceptSource: (state, action: PayloadAction<{ id: string, url: string, originalText: string }>) => {
      const node = state.allClimateConceptNodes.find(node => node.climateConcept.id === action.payload.id);
      if (!node) {
        return;
      }

      node.climateConcept.sources.push({ url: action.payload.url, originalText: action.payload.originalText });

      state.allClimateConceptNodes = [...state.allClimateConceptNodes.filter(node => node.climateConcept.id !== action.payload.id), node];
    },
    deleteClimateConceptSource: (state, action: PayloadAction<{ id: string, url: string, originalText: string }>) => {
      const node = state.allClimateConceptNodes.find(node => node.climateConcept.id === action.payload.id);
      if (!node) {
        return;
      }

      node.climateConcept.sources = node.climateConcept.sources.filter(n => 
        n.url !== action.payload.url && n.originalText !== action.payload.originalText
      );

      state.allClimateConceptNodes = [...state.allClimateConceptNodes.filter(node => node.climateConcept.id !== action.payload.id), node];
    },
    updateClimateConceptNodeStringRepresentation: (state, action: PayloadAction<{ id: string, newName: string }>) => {
      const node = state.allClimateConceptNodes.find(node => node.climateConcept.id === action.payload.id);
      if (!node) {
        return;
      }

      node.climateConcept.stringRepresentation = action.payload.newName;

      state.allClimateConceptNodes = [...state.allClimateConceptNodes.filter(node => node.climateConcept.id !== action.payload.id), node];
    },
    //#endregion
    
    //#region ClimateConceptNode Stuff
    addClimateConceptNode: (state, action: PayloadAction<{ id: string, stringRepresentation: string, x: number, y: number }>) => {
      const node: ClimateConceptNodesRepository.AggregatedClimateConceptNodeModel = {
        x: action.payload.x,
        y: action.payload.y,
        size: 2,

        needsReview: false,
        needsCorrection: false,

        climateConcept: {
          id: action.payload.id,
          stringRepresentation: action.payload.stringRepresentation,
          incomingConnections: [],
          outgoingConnections: [],
          sources: [],
        }
      }

      state.allClimateConceptNodes.push(node);
    },
    deleteClimateConceptNode: (state, action: PayloadAction<{id: string}>) => {
      state.allClimateConceptNodes.filter(node => node.climateConcept.id !== action.payload.id);
    },

    addClimateConceptEdge: (state, action: PayloadAction<{ sourceId: string, targetId: string }>) => {
      const sourceNode = state.allClimateConceptNodes.find(node => node.climateConcept.id === action.payload.sourceId);
      const targetNode = state.allClimateConceptNodes.find(node => node.climateConcept.id === action.payload.targetId);
      if (!sourceNode || !targetNode) {
        return;
      }

      sourceNode.climateConcept.outgoingConnections.push(action.payload.targetId);
      targetNode.climateConcept.incomingConnections.push(action.payload.sourceId);
    },
    deleteClimateConceptEdge: (state, action: PayloadAction<{ sourceId: string, targetId: string }>) => {
      const sourceNode = state.allClimateConceptNodes.find(node => node.climateConcept.id === action.payload.sourceId);
      const targetNode = state.allClimateConceptNodes.find(node => node.climateConcept.id === action.payload.targetId);
      if (!sourceNode || !targetNode) {
        return;
      }

      sourceNode.climateConcept.outgoingConnections = sourceNode.climateConcept.outgoingConnections.filter(id => id !== action.payload.targetId);
      targetNode.climateConcept.incomingConnections = targetNode.climateConcept.incomingConnections.filter(id => id !== action.payload.sourceId);
    },
    updateClimateConceptLabel: (state, action: PayloadAction<{ id: string, label: 'NeedsReview' | 'NeedsCorrection', value: boolean }>) => {
      const node = state.allClimateConceptNodes.find(node => node.climateConcept.id === action.payload.id);
      if (!node) {
        return;
      }

      if (action.payload.label === 'NeedsReview') {
        node.needsReview = action.payload.value;
      } else if (action.payload.label === 'NeedsCorrection') {
        node.needsCorrection = action.payload.value;
      }
    },
    //#endregion    
    
    //#region Summary Node Stuff
    newSummaryNode: (state, action: PayloadAction<{ id: string, x: number, y: number, combinedNode: string[] }>) => {
      const newNode: SummaryNodesRepository.SummaryNodeModel = {
        name: '', id: action.payload.id, x: action.payload.x, y: action.payload.y, size: 5, combinedNodes: action.payload.combinedNode,
      };

      state.allSummaryNodes.push(newNode);
    },
    deleteSummaryNode: (state, action: PayloadAction<string>) => {
      state.allSummaryNodes = state.allSummaryNodes.filter(node => node.id !== action.payload);
    },
    
    updateSummaryNodeName: (state, action: PayloadAction<{ id: string, newName: string }>) => {
      const node = state.allSummaryNodes.find(node => node.id === action.payload.id);
      if (!node) {
        return;
      }

      node.name = action.payload.newName;

      state.allSummaryNodes = [...state.allSummaryNodes.filter(node => node.id !== action.payload.id), node];
    },

    addCombinedNode: (state, action: PayloadAction<{ summaryNodeId: string, stringRepresentation?: string, climateConceptId?: string }>) => {
      if (action.payload.stringRepresentation) {
        const climateConceptNode = state.allClimateConceptNodes.find(node => node.climateConcept.stringRepresentation === action.payload.stringRepresentation);
        if (!climateConceptNode) {
          return;
        }
  
        const summaryNode = state.allSummaryNodes.find(node => node.id === action.payload.summaryNodeId)!;
        if (!summaryNode.combinedNodes.includes(climateConceptNode.climateConcept.id)) {
          summaryNode.combinedNodes.push(climateConceptNode.climateConcept.id);
        }
      } else if (action.payload.climateConceptId) {
        const summaryNode = state.allSummaryNodes.find(node => node.id === action.payload.summaryNodeId)!;
        if (!summaryNode.combinedNodes.includes(action.payload.climateConceptId)) {
          summaryNode.combinedNodes.push(action.payload.climateConceptId);
        }
        // state.allSummaryNodes.find(node => node.id === action.payload.summaryNodeId)!.combinedNodes.push(action.payload.climateConceptId);
      }
      
    },
    removeCombinedNode: (state, action: PayloadAction<{ summaryNodeId: string, climateConceptNodeId: string }>) => {
      const summaryNode = state.allSummaryNodes.find(node => node.id === action.payload.summaryNodeId);
      if (!summaryNode) {
        return;
      }

      // Remove climate concept node from combined nodes
      summaryNode.combinedNodes = summaryNode.combinedNodes.filter(id => id !== action.payload.climateConceptNodeId);      
    },
    //#endregion
  },
});

// export const getClimateConceptNodeById = createSelector(
//   [
//     (state: RootState) => state.data.allClimateConceptNodes,
//     (state, id: string) => id,
//   ],
//   (items, id) => {
//     const result = items.find(node => node.climateConcept.id === id);
//     if (!result) {
//       throw new Error(`Could not find climate concept node in array of combined nodes [id: ${id}]`)
//     }

//     return result;
//   }
// );

export const {
  initAllClimateConceptNodes, initAllSummaryNodes,
  addClimateConceptSource, deleteClimateConceptSource,
  updateClimateConceptNodeStringRepresentation,
  
  addClimateConceptNode, deleteClimateConceptNode,
  addClimateConceptEdge, deleteClimateConceptEdge,
  updateClimateConceptLabel,
  
  newSummaryNode, deleteSummaryNode, updateSummaryNodeName,
  addCombinedNode, removeCombinedNode,
} = dataSlice.actions;

export default dataSlice.reducer;

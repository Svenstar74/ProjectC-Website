import { useContext, useState } from 'react';
import { ListItemIcon, ListItemText, MenuItem, Menu } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import NorthEastIcon from '@mui/icons-material/NorthEast';

import useApiClient from '../hooks/useApiClient';
import { useAppDispatch, useAppSelector } from '../store/redux/hooks';
import NewNodeDialog from './dialogs/NewNodeDialog';
import ConfirmDialog from './dialogs/ConfirmDialog';
import NewEdgeDialog from './dialogs/NewEdgeDialog';
import { AppContext } from '../store/context/AppContext';
import { addClimateConceptEdge, deleteClimateConceptEdge } from '../store/redux/slices/dataSlice';

type Props = {
  show: boolean;
  position: { x: number, y: number };
  menuItems: ('addNode' | 'deleteNode' | 'addEdge' | 'deleteEdge')[];
  onClose: () => void;
}

function ContextMenu({ show, position, menuItems, onClose }: Props) {
  const { globalSigmaInstance } = useContext(AppContext);
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const selectedNodeId = useAppSelector(state => state.graph.selectedNode);
  const selectedEdgeIds = useAppSelector(state => state.graph.selectedEdge);
  
  const [showNewNodeDialog, setShowNewNodeDialog] = useState(false);
  const [showDelNodeDialog, setShowDelNodeDialog] = useState(false);
  const [showNewEdgeDialog, setShowNewEdgeDialog] = useState(false);
  const [showDelEdgeDialog, setShowDelEdgeDialog] = useState(false);
  
  async function confirmDeleteEdge() {
    setShowDelEdgeDialog(false);
    const result = await apiClient.deleteEdge(selectedEdgeIds[0], selectedEdgeIds[1]);
    if (result === 200) {
      dispatch(deleteClimateConceptEdge({ sourceId: selectedEdgeIds[0], targetId: selectedEdgeIds[1] }));
      globalSigmaInstance?.getGraph().dropEdge(selectedEdgeIds[0], selectedEdgeIds[1]);  
    }
  }

  function confirmDeleteNode() {
    apiClient.deleteClimateConceptNode(selectedNodeId);
    setShowDelNodeDialog(false);
  }
  
  return (
    <div>
      {/* Show dialog when associated menu item was clicked */}
      <NewNodeDialog
        open={showNewNodeDialog}
        onClose={() => setShowNewNodeDialog(false)}
        position={position}
      />

      {/* Confirm deleting a node */}
      <ConfirmDialog
        open={showDelNodeDialog}
        onCancel={() => setShowDelNodeDialog(false)}
        onConfirm={confirmDeleteNode}
        content={
          <>
            <span>Are you sure you want to delete this node?</span><br/>
            <span>This action cannot be undone.</span>
          </>
        }
        confirmBtnText="Yes"
      />

      {/* Create a new edge */}
      <NewEdgeDialog
        open={showNewEdgeDialog}
        onClose={() => setShowNewEdgeDialog(false)}
        causeNodeId={selectedNodeId}
      />

      {/* Confirm deleting an edge */}
      <ConfirmDialog
        open={showDelEdgeDialog}
        onCancel={() => setShowDelEdgeDialog(false)}
        onConfirm={confirmDeleteEdge}
        content={
          <>
            <span>Are you sure you want to delete this edge?</span><br/>
            <span>This action cannot be undone.</span>
          </>
        }
        confirmBtnText="Yes"
      />

      {/* Show the menu itself */}
      <Menu
        open={show}
        anchorReference="anchorPosition"
        anchorPosition={{ top: position.y, left: position.x }}
        onClose={onClose}
      >
        {menuItems.includes('addNode') && (
          <MenuItem
            onClick={() => {
              setShowNewNodeDialog(true);
              onClose();
            }}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText>New Node</ListItemText>
          </MenuItem>
        )}

        {menuItems.includes('deleteNode') && (
          <MenuItem
            onClick={() => {
              setShowDelNodeDialog(true);
              onClose();
            }}
          >
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText>Delete Node</ListItemText>
          </MenuItem>
        )}

        {menuItems.includes('addEdge') && (
          <MenuItem
            onClick={() => {
              setShowNewEdgeDialog(true);
              onClose();
            }}
          >
            <ListItemIcon>
              <NorthEastIcon />
            </ListItemIcon>
            <ListItemText>Add Edge</ListItemText>
          </MenuItem>
        )}

        {menuItems.includes('deleteEdge') && (
          <MenuItem
            onClick={() => {
              setShowDelEdgeDialog(true);
              onClose();
            }}
          >
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText>Delete Edge</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}

export default ContextMenu;

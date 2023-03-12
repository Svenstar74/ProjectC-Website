import Paper from '@mui/material/Paper';
import MenuList from "@mui/material/MenuList";
import { ListItemIcon, MenuItem } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import NorthEastIcon from '@mui/icons-material/NorthEast';

import { useAppDispatch, useAppSelector } from "../store/hooks";
import classes from './ContextMenu.module.css';
import ListItemText from '@mui/material/ListItemText';
import { showDelEdgeDialog, showNewEdgeDialog, showNewNodeDialog } from '../store/uiSlice';
import { useApiClient } from '../hooks/useApiClient';

export const ContextMenu = () => {
  const apiClient = useApiClient();
  
  const showContextMenu = useAppSelector(state => state.ui.showContextMenu);
  const contextMenuOptions = useAppSelector(state => state.ui.contextMenuOptions);
  const contextMenuPosition = useAppSelector(state => state.ui.contextMenuPosition);
  const nodeToDelete = useAppSelector(state => state.ui.selectedNode);
  
  const dispatch = useAppDispatch();
  
  if (!showContextMenu || contextMenuPosition.length === 0) {
    return null;
  }
  
  const deleteNode = async () => {
    if (nodeToDelete) {
      await apiClient.deleteNode(nodeToDelete);
    }
  }
  
  return (
    <div>
      <Paper className={classes.container} style={{ left: contextMenuPosition[0], top: contextMenuPosition[1]}}>
        <MenuList>
          {contextMenuOptions.includes('addNode') && <MenuItem onClick={() => dispatch(showNewNodeDialog())}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText>New Node</ListItemText>
          </MenuItem>}
          {contextMenuOptions.includes('deleteNode') && <MenuItem onClick={deleteNode}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText>Delete Node</ListItemText>
          </MenuItem>}
          {contextMenuOptions.includes('addEdge') && <MenuItem onClick={() => dispatch(showNewEdgeDialog())}>
            <ListItemIcon>
              <NorthEastIcon />
            </ListItemIcon>
            <ListItemText>Add Edge</ListItemText>
          </MenuItem>}
          {contextMenuOptions.includes('deleteEdge') && <MenuItem onClick={() => dispatch(showDelEdgeDialog())}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText>Delete Edge</ListItemText>
          </MenuItem>}
        </MenuList>
      </Paper>
    </div>
  );
}
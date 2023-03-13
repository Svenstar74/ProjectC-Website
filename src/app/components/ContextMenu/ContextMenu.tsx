import { Paper, MenuList, ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import NorthEastIcon from '@mui/icons-material/NorthEast';

import { useApiClient } from '../../hooks/useApiClient';
import { useAppDispatch } from "../../store/redux/hooks";
import { showDelEdgeDialog, showNewEdgeDialog, showNewNodeDialog } from '../../store/redux/uiSlice';

type ContextMenuProps = {
  show: boolean;
  position: { x: number, y: number };
  menuItems: string[];
  clickedItemId?: string;
};

export const ContextMenu = ({ show, position, menuItems, clickedItemId = '' }: ContextMenuProps) => {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  
  if (!show) {
    return null;
  }
    
  return (
    <div>
      <Paper style={{ position: 'absolute', left: position.x, top: position.y, zIndex: '100'}}>
        <MenuList>       

          {menuItems.includes('addNode') && <MenuItem onClick={() => dispatch(showNewNodeDialog())}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText>New Node</ListItemText>
          </MenuItem>}

          {menuItems.includes('deleteNode') && <MenuItem onClick={() => apiClient.deleteNode(clickedItemId)}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText>Delete Node</ListItemText>
          </MenuItem>}

          {menuItems.includes('addEdge') && <MenuItem onClick={() => dispatch(showNewEdgeDialog())}>
            <ListItemIcon>
              <NorthEastIcon />
            </ListItemIcon>
            <ListItemText>Add Edge</ListItemText>
          </MenuItem>}

          {menuItems.includes('deleteEdge') && <MenuItem onClick={() => dispatch(showDelEdgeDialog())}>
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

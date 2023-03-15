import { FC, useState } from "react";

import { Paper, MenuList, ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import NorthEastIcon from '@mui/icons-material/NorthEast';

import { useApiClient } from '../../hooks/useApiClient';

import { NewNodeDialog } from "../NewNodeDialog";
import { NewEdgeDialog } from "../NewEdgeDialog";
import { DelEdgeDialog } from "../DelEdgeDialog";

type Props = {
  show: boolean;
  position: { x: number, y: number };
  menuItems: string[];
  clickedItemId?: string;
};

export const ContextMenu: FC<Props> = ({ show, position, menuItems, clickedItemId = '' }) => {
  const apiClient = useApiClient();
  
  const [showNewNodeDialog, setShowNewNodeDialog] = useState(false);
  const [showNewEdgeDialog, setShowNewEdgeDialog] = useState(false);
  const [showDelEdgeDialog, setShowDelEdgeDialog] = useState(false);
      
  return (
    <div>
      {/* Show dialog when associated menu item was clicked */}
      <NewNodeDialog open={showNewNodeDialog} onClose={() => setShowNewNodeDialog(false)} />
      <NewEdgeDialog open={showNewEdgeDialog} onClose={() => setShowNewEdgeDialog(false)} />
      <DelEdgeDialog open={showDelEdgeDialog} onClose={() => setShowDelEdgeDialog(false)} />

      {/* Show the dialog itself */}
      {show && <Paper style={{ position: 'absolute', left: position.x, top: position.y, zIndex: '100'}}>
        <MenuList>       

          {menuItems.includes('addNode') && <MenuItem onClick={() => setShowNewNodeDialog(true)}>
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

          {menuItems.includes('addEdge') && <MenuItem onClick={() => setShowNewEdgeDialog(true)}>
            <ListItemIcon>
              <NorthEastIcon />
            </ListItemIcon>
            <ListItemText>Add Edge</ListItemText>
          </MenuItem>}

          {menuItems.includes('deleteEdge') && <MenuItem onClick={() => setShowDelEdgeDialog(true)}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText>Delete Edge</ListItemText>
          </MenuItem>}

        </MenuList>
      </Paper>}
    </div>
  );
}

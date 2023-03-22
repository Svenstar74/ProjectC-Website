import { FC, useState } from 'react';

import { ListItemIcon, ListItemText, MenuItem, Menu } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import NorthEastIcon from '@mui/icons-material/NorthEast';

import { NewNodeDialog } from './Dialogs/NewNodeDialog';
import { NewEdgeDialog } from './Dialogs/NewEdgeDialog';
import { DelEdgeDialog } from './Dialogs/DelEdgeDialog';
import { DelNodeDialog } from './Dialogs/DelNodeDialog';

type Props = {
  show: boolean;
  position: { x: number; y: number };
  menuItems: string[];
  clickedNodeId?: string;
  clickedEdgeNodeIds?: { cause: string; effect: string };
  onClose: () => void;
};

export const ContextMenu: FC<Props> = ({
  show,
  position,
  menuItems,
  clickedNodeId = '',
  clickedEdgeNodeIds = { cause: '', effect: '' },
  onClose,
}) => {
  const [showNewNodeDialog, setShowNewNodeDialog] = useState(false);
  const [showDelNodeDialog, setShowDelNodeDialog] = useState(false);
  const [showNewEdgeDialog, setShowNewEdgeDialog] = useState(false);
  const [showDelEdgeDialog, setShowDelEdgeDialog] = useState(false);

  return (
    <div>
      {/* Show dialog when associated menu item was clicked */}
      <NewNodeDialog
        open={showNewNodeDialog}
        onClose={() => setShowNewNodeDialog(false)}
        position={position}
      />
      <DelNodeDialog
        open={showDelNodeDialog}
        onClose={() => setShowDelNodeDialog(false)}
        nodeToDelete={clickedNodeId}
      />
      <NewEdgeDialog
        open={showNewEdgeDialog}
        onClose={() => setShowNewEdgeDialog(false)}
        causeNodeId={clickedNodeId}
      />
      <DelEdgeDialog
        open={showDelEdgeDialog}
        onClose={() => setShowDelEdgeDialog(false)}
        deletedEdgeSource={clickedEdgeNodeIds.cause}
        deletedEdgeTarget={clickedEdgeNodeIds.effect}
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
};

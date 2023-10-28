import { useEffect, useState } from 'react';
import { useRegisterEvents, useSigma } from '@react-sigma/core';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import AddNodeDialog from './AddNodeDialog';
import { useAppSelector } from '../../../store/redux/hooks';

function GraphEvents() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const [showAddNodeDialog, setShowAddNodeDialog] = useState(false);
  
  function onClose() {
    setShowContextMenu(false);
  }

  useEffect(() => {
    registerEvents({
      rightClickStage(e) {
        setShowContextMenu(true);
        setContextMenuPosition({ x: e.event.x, y: e.event.y });
      }
    });
  }, [sigma, registerEvents]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <Menu
        open={showContextMenu}
        anchorReference='anchorPosition'
        anchorPosition={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
        onClose={onClose}
      >
        <MenuItem
          onClick={() => {
            setShowAddNodeDialog(true);
            onClose();
          }}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText>New Node</ListItemText>
        </MenuItem>
      </Menu>

      <AddNodeDialog
        open={showAddNodeDialog}
        position={contextMenuPosition}
        onClose={() => setShowAddNodeDialog(false)}
      />
    </>
  );
}

export default GraphEvents;

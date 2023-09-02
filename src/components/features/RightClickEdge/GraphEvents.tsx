import { useEffect, useState } from 'react';
import { useRegisterEvents, useSigma } from '@react-sigma/core';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import ConfirmDialog from '../../dialogs/ConfirmDialog';
import useApiClient from '../../hooks/useApiClient';
import { useAppSelector } from '../../../store/redux/hooks';

function GraphEvents() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const apiClient = useApiClient();
  
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();

  const [edgeId, setEdgeId] = useState<string>();
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  function deleteEdgeHandler() {
    setShowConfirmationDialog(false);
    setShowContextMenu(false);

    apiClient.deleteConnection(edgeId);

    sigma.getGraph().dropEdge(edgeId);
    sigma.refresh();
  }
  
  useEffect(() => {
    registerEvents({
      rightClickEdge(e) {
        setEdgeId(e.edge);
        setShowContextMenu(true);
        setContextMenuPosition({ x: e.event.x, y: e.event.y });
      },
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
        onClose={() => setShowContextMenu(false)}
      >
        <MenuItem
          onClick={() => {
            setShowContextMenu(false);
            setShowConfirmationDialog(true);
          }
        }>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete Edge</ListItemText>
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={showConfirmationDialog}
        title='Delete Edge'
        content='Are you sure you want to delete this edge?'
        onConfirm={deleteEdgeHandler}
        onCancel={() => setShowConfirmationDialog(false)}
      />

    </>
  );
}

export default GraphEvents;

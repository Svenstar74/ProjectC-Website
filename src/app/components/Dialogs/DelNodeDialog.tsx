import { FC } from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

import { useApiClient } from '../../hooks/useApiClient';

interface Props {
  open: boolean;
  nodeToDelete: string;
  onClose: () => void;
}

export const DelNodeDialog: FC<Props> = ({ open, nodeToDelete, onClose }) => {
  const apiClient = useApiClient();

  const deleteNode = () => {
    apiClient.deleteNode(nodeToDelete);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Are you sure you want to delete this node?</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button onClick={deleteNode} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

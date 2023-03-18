import { FC } from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

import { useApiClient } from '../hooks/useApiClient';
import { useAppSelector } from '../store/redux/hooks';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const DelEdgeDialog: FC<Props> = ({ open, onClose }) => {
  const apiClient = useApiClient();
  
  const deletedEdgeSource = useAppSelector(state => state.ui.deletedEdgeSource);
  const deletedEdgeTarget = useAppSelector(state => state.ui.deletedEdgeTarget);
  
  const deleteEdge = () => {
    apiClient.deleteEdge(deletedEdgeSource, deletedEdgeTarget);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Delete Edge?</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button onClick={deleteEdge} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

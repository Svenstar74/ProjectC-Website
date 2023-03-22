import { FC } from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

import { useApiClient } from '../../hooks/useApiClient';

interface Props {
  open: boolean;
  onClose: () => void;
  deletedEdgeSource: string;
  deletedEdgeTarget: string;
}

export const DelEdgeDialog: FC<Props> = ({
  open,
  deletedEdgeSource,
  deletedEdgeTarget,
  onClose,
}) => {
  const apiClient = useApiClient();

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

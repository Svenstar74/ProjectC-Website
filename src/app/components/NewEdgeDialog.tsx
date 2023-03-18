import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useApiClient } from '../hooks/useApiClient';

interface Props {
  open: boolean;
  onClose: () => void;
  causeNodeId: string;
}

export const NewEdgeDialog: FC<Props> = ({ open, onClose, causeNodeId }) => {
  const apiClient = useApiClient();

  const submitDisabled = () => {
    return selectedValue === null;
  };

  const submitForm = () => {
    apiClient.addEdge(causeNodeId, selectedValue!);
    onClose();
  };

  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [stringRepresentations, setStringRepresentations] = useState<string[]>([]);
  
  useEffect(() => {
    apiClient.getListOfStringRepresentations().then((data) => {
      setStringRepresentations(data);
    });

    // eslint-disable-next-line
  }, [open]);

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Add New Edge</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ marginBottom: '20px' }}>
            Enter the string representation of the node you want to connect to.
          </DialogContentText>

          <Autocomplete
            fullWidth
            options={stringRepresentations}
            autoHighlight
            renderInput={(params) => (
              <TextField autoFocus {...params} label="Choose an Effect" />
            )}
            onChange={(event, value) => setSelectedValue(value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button disabled={submitDisabled()} onClick={submitForm}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

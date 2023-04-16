import { useEffect, useState } from 'react';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import useApiClient from '../../hooks/useApiClient';
import { useAppSelector } from '../../store/redux/hooks';

interface Props {
  open: boolean;
  onClose: () => void;
  causeNodeId: string;
}

function NewEdgeDialog({ open, onClose, causeNodeId }: Props) {
  const apiClient = useApiClient();
  const allClimateConceptNodes = useAppSelector(state => state.data.allClimateConceptNodes);
  
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
    const filtered = allClimateConceptNodes.filter(node => node.climateConcept.id !== causeNodeId);
    const mapped = filtered.map(node => node.climateConcept.stringRepresentation);
    setStringRepresentations(mapped);
  }, [allClimateConceptNodes, causeNodeId]);

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

export default NewEdgeDialog;

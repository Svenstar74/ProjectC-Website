import { useState } from 'react';
import { useSigma } from '@react-sigma/core';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, TextField } from '@mui/material';
import { ClimateConceptUseCases } from 'business-logic';
import useApiClient from '../../hooks/useApiClient';



interface Props {
  open: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

function AddNodeDialog({ open, onClose, position }: Props) {
  const apiClient = useApiClient();
  const sigma = useSigma();

  const [error, setError] = useState('');

  const [currentChangeDirection, setCurrentChangeDirection] = useState('decrease');
  const [currentTypeOf, setCurrentTypeOf] = useState('');
  const [currentBase, setCurrentBase] = useState('');
  const [currentAspectChanging, setCurrentAspectChanging] = useState('');

  const submitDisabled = (): boolean => {
    if (currentChangeDirection === '' || currentBase === '' || currentAspectChanging === '') {
      return true;
    }

    const string = `${currentChangeDirection}_${currentTypeOf}_${currentBase}_${currentAspectChanging}`;
    
    
    if (!ClimateConceptUseCases.validateName(string)) {
      return true;
    }

    return false;
  };

  const submitForm = async () => {
    const stringRepresentation = `${currentChangeDirection}_${currentTypeOf}_${currentBase}_${currentAspectChanging}`;
    const nodePosition = sigma.viewportToGraph(position);

    try {
      const node = await apiClient.createClimateConceptNode(stringRepresentation, nodePosition.x, nodePosition.y);
      sigma.getGraph().addNode(node.id, { x: node.x, y: node.y, size: 2, label: stringRepresentation, forceLabel: true });
      onClose();
    } catch (e) {
      setError('Error while creating the node.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Node</DialogTitle>
      <DialogContent>

        <DialogContentText style={{ marginBottom: '20px' }}>
          Enter the individual components for the string representation of the
          new node. It will be positioned at the place where you opened the
          menu.
          <br />
          Note: You cannot use underscores '_'
        </DialogContentText>

        {/* Change Direction */}
        <Select
          required
          fullWidth
          variant="standard"
          label="Change Direction"
          defaultValue="decrease"
          onChange={(event) => setCurrentChangeDirection(event.target.value)}
          style={{ marginBottom: '20px' }}
        >
          <MenuItem value="increase">increase</MenuItem>
          <MenuItem value="decrease">decrease</MenuItem>
        </Select>

        {/* Type Of */}
        <TextField
          autoFocus
          fullWidth
          variant="standard"
          label="Type of"
          helperText="Use commas to seperate multiple values"
          onChange={(event) => setCurrentTypeOf(event.target.value)}
          style={{ marginBottom: '20px' }}
        />

        {/* Base */}
        <TextField
          required
          fullWidth
          variant="standard"
          label="Base"
          onChange={(event) => setCurrentBase(event.target.value)}
          style={{ marginBottom: '20px' }}
        />

        {/* Aspect Changing */}
        <TextField
          required
          fullWidth
          variant="standard"
          label="Aspect Changing"
          onChange={(event) => setCurrentAspectChanging(event.target.value)}
          style={{ marginBottom: '20px' }}
        />

        {error !== '' && <Alert severity="error">{error}</Alert>}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={submitDisabled()} onClick={submitForm}>Add</Button>
      </DialogActions>

    </Dialog>
  );
}

export default AddNodeDialog;

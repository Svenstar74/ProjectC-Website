import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, TextField } from '@mui/material';
import { ClimateConceptUseCases } from 'business-logic';
import useApiClient from '../../hooks/useApiClient';

interface Props {
  open: boolean;
  onClose: (newName: string) => void;
  climateConceptId: string;
  current: string;
}

function EditStringRepresentationDialog({
  open,
  onClose,
  climateConceptId,
  current,
}: Props) {  
  const apiClient = useApiClient();
  
  const stringRepresentation = ClimateConceptUseCases.dissectName(current);
  const [currentChangeDirection, setCurrentChangeDirection] = useState(stringRepresentation.changeDirection);
  const [currentTypeOf, setCurrentTypeOf] = useState(stringRepresentation.typeOf.join(', '));
  const [currentBase, setCurrentBase] = useState(stringRepresentation.base);
  const [currentAspectChanging, setCurrentAspectChanging] = useState(stringRepresentation.aspectChanging);

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
    const string = `${currentChangeDirection}_${currentTypeOf}_${currentBase}_${currentAspectChanging}`;
    apiClient.updateClimateConceptName(climateConceptId, string);
    onClose(string);
  };
  
  useEffect(() => {
    const stringRepresentation = ClimateConceptUseCases.dissectName(current);

    setCurrentAspectChanging(stringRepresentation.changeDirection);
    setCurrentTypeOf(stringRepresentation.typeOf.join(', '));
    setCurrentBase(stringRepresentation.base);
    setCurrentAspectChanging(stringRepresentation.aspectChanging);
  }, [current]);

  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Edit String Representation</DialogTitle>
        <DialogContent>

          <DialogContentText style={{ marginBottom: '20px' }}>
            Enter the individual components for the string representation of the
            node.
            <br />
            Note: You cannot use underscores '_'
          </DialogContentText>

          {/* Change Direction */}
          <Select
            required
            fullWidth
            variant="standard"
            label="Change Direction"
            value={currentChangeDirection}
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
            value={currentTypeOf}
            onChange={(event) => setCurrentTypeOf(event.target.value)}
            style={{ marginBottom: '20px' }}
          />

          {/* Base */}
          <TextField
            required
            fullWidth
            variant="standard"
            label="Base"
            value={currentBase}
            onChange={(event) => setCurrentBase(event.target.value)}
            style={{ marginBottom: '20px' }}
          />

          {/* Aspect Changing */}
          <TextField
            required
            fullWidth
            variant="standard"
            label="Aspect Changing"
            value={currentAspectChanging}
            onChange={(event) => setCurrentAspectChanging(event.target.value)}
            style={{ marginBottom: '20px' }}
          />

        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => onClose(current)}>Cancel</Button>
          <Button disabled={submitDisabled()} onClick={submitForm}>
            Save
          </Button>
        </DialogActions>
        
      </Dialog>
    </div>
  );
}

export default EditStringRepresentationDialog;

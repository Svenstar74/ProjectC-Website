import { useEffect, useState } from 'react';
import { useSigma } from '@react-sigma/core';
import { LoadingButton } from '@mui/lab';
import {
  Alert, Button, Collapse, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography
} from '@mui/material';

import { useCreateNode } from '../hooks';
import { useCenterNode } from '../../center-node';

interface Props {
  open: boolean;
  clickPosition: { x: number; y: number };
  onClose: () => void;
}

function CreateNodeDialog({ open, clickPosition, onClose }: Props) {
  const sigma = useSigma();
  const { centerNode, centerNodeByName } = useCenterNode();

  const { isPending, isError, error, reset, createNode } = useCreateNode();

  const [changeDirection, setChangeDirection] = useState('decrease');
  const [typeOf, setTypeOf] = useState('');
  const [base, setBase] = useState('');
  const [aspectChanging, setAspectChanging] = useState('');

  function disableSubmit() {
    return base === '' || aspectChanging === '';
  }

  function submitHandler() {
    const nodePosition = sigma.viewportToGraph(clickPosition);

    createNode(
      {
        ...nodePosition,
        name: `${changeDirection}_${typeOf}_${base}_${aspectChanging}`,
        createdBy: 'unknown',
      },
      {
        onSuccess(response) {
          onClose();
          centerNode(response.data.id);
        },
      }
    );
  }

  function showExistingNodeHandler() {
    onClose();
    centerNodeByName(`${changeDirection}_${typeOf}_${base}_${aspectChanging}`);
  }

  useEffect(() => {
    setChangeDirection('decrease');
    setTypeOf('');
    setBase('');
    setAspectChanging('');
    reset();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Node</DialogTitle>
      <DialogContent>
        <DialogContentText style={{ marginBottom: 20 }}>
          Enter the individual components for the string representation of the new node. It will be
          positioned at the place where you opened the menu.
          <br />
          <Typography variant='caption'>Note: You cannot use underscores '_'</Typography>
        </DialogContentText>

        {/* Change Direction */}
        <FormControl required fullWidth variant='standard' style={{ marginBottom: 20 }}>
          <InputLabel id='change-direction-label'>Change Direction</InputLabel>
          <Select
            labelId='change-direction-label'
            defaultValue='decrease'
            onChange={(event) => setChangeDirection(event.target.value)}
            value={changeDirection}
          >
            <MenuItem value='increase'>increase</MenuItem>
            <MenuItem value='decrease'>decrease</MenuItem>
          </Select>
        </FormControl>

        {/* Type Of */}
        <TextField
          autoFocus
          fullWidth
          variant='standard'
          label='Type of'
          helperText='Use commas to seperate multiple values'
          onChange={(event) => {
            setTypeOf(event.target.value);
            reset();
          }}
          value={typeOf}
          style={{ marginBottom: '20px' }}
        />

        {/* Base */}
        <TextField
          required
          fullWidth
          variant='standard'
          label='Base'
          onChange={(event) => {
            setBase(event.target.value);
            reset();
          }}
          value={base}
          style={{ marginBottom: '20px' }}
        />

        {/* Aspect Changing */}
        <TextField
          required
          fullWidth
          variant='standard'
          label='Aspect Changing'
          onChange={(event) => {
            setAspectChanging(event.target.value);
            reset();
          }}
          value={aspectChanging}
        />

        <Collapse in={isError}>
          <Alert
            severity='error'
            style={{ marginTop: 20 }}
            action={
              <>
                {error && error.status === 409 && (
                  <Button color='inherit' size='small' onClick={showExistingNodeHandler}>
                    Show Node
                  </Button>
                )}
              </>
            }
          >
            {error?.message}
          </Alert>
        </Collapse>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => { onClose(); reset(); }}>Cancel</Button>
        <LoadingButton loading={isPending} onClick={submitHandler} disabled={disableSubmit()}>
          Create
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default CreateNodeDialog;

import { useEffect, useState } from 'react';
import { Button, Snackbar } from '@mui/material';
import { eventBus } from '../../../eventBus';

function AddConnectionSnackbar() {
  const [open, setOpen] = useState(false);

  function handleCancelButton() {
    setOpen(false);
    eventBus.emit('cancelMakingConnection');
  }

  // Handle events to communicate with other parts of the app
  useEffect(() => {
    function onStartMakingConnection() {
      setOpen(true);
    }

    function onCompleteConnection() {
      setOpen(false);
    }

    eventBus.on('makingConnection', onStartMakingConnection);
    eventBus.on('connectionMade', onCompleteConnection);

    return () => {
      eventBus.off('makingConnection', onStartMakingConnection);
      eventBus.off('connectionMade', onCompleteConnection);
    };
  }, []);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      message='Click on a node to add a connection.'
      action={
        <Button variant='text' onClick={handleCancelButton}>
          <b>Cancel</b>
        </Button>
      }
    />
  );
}

export default AddConnectionSnackbar;

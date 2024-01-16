import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
}

function ErrorDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open}>
      <DialogTitle>Error creating connection</DialogTitle>

      <DialogContent>
        <DialogContentText>
          When creating a connection of type 'contributes to', it is necessary to have
          an identical source on both the start and end nodes. Please make sure that
          this source exists.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ErrorDialog;

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

function DeleteCommentDialog({ open, onClose, onDelete }: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Comment</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this comment?
        </DialogContentText>
      </DialogContent>

      <DialogActions style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 20, justifyContent: 'space-between' }}>
        <Button color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="outlined" color="error" onClick={onDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteCommentDialog;

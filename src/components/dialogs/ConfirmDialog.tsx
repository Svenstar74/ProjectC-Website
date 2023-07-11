import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  content?: React.ReactNode;
  cancelBtnText?: string;
  confirmBtnText?: string;
}

function ConfirmDialog({
  open, onConfirm, onCancel,
  title='Confirm', content='Are you sure?',
  cancelBtnText='Cancel', confirmBtnText='Confirm'
}: Props) {  
  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText style={{ marginRight: '25px' }}>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelBtnText}</Button>
        <Button onClick={onConfirm}>{confirmBtnText}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;

import { FC } from "react";
import { Button, Dialog, DialogActions, DialogContentText, DialogTitle } from "@mui/material";

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  content?: React.ReactNode;
  cancelBtnText?: string;
  confirmBtnText?: string;
}

const ConfirmDialog: FC<Props> = ({
  open, onConfirm, onCancel,
  title='Confirm', content='Are you sure?',
  cancelBtnText='Cancel', confirmBtnText='Confirm'
}) => {  
  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContentText style={{padding: '0 25px'}}>
        {content}
      </DialogContentText>
      <DialogActions>
        <Button onClick={onCancel}>{cancelBtnText}</Button>
        <Button onClick={onConfirm}>{confirmBtnText}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;

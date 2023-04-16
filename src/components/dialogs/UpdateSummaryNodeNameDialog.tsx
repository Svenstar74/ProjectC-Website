import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import useApiClient from "../../hooks/useApiClient";
import { useAppDispatch } from "../../store/redux/hooks";
import { AppContext } from "../../store/context/AppContext";
import { updateSummaryNodeName } from "../../store/redux/slices/dataSlice";

interface Props {
  open: boolean;
  id: string;
  currentName: string;
  onClose: () => void;
}

function UpdateSummaryNodeNameDialog({ open, id, currentName, onClose }: Props) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const { globalSigmaInstance } = useContext(AppContext);
  
  const [newName, setNewName] = useState(currentName);

  function submitForm() {
    apiClient.renameSummaryNode(id, newName);
    globalSigmaInstance?.getGraph().setNodeAttribute(id, 'label', newName);
    dispatch(updateSummaryNodeName({ id, newName }));
    onClose();
  }
  
  useEffect(() => {
    setNewName(currentName);
  }, [currentName]);

  return (
    <Dialog open={open}>
      <DialogTitle>Change Name</DialogTitle>
      <DialogContent>
        <TextField
          label="New Name"
          variant="outlined"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          style={{ marginTop: 4, minWidth: 300 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={submitForm}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateSummaryNodeNameDialog;

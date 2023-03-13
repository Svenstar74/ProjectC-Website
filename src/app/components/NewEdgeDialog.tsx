import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import { useEffect, useState } from "react";
import { useApiClient } from "../hooks/useApiClient";
import { useAppDispatch, useAppSelector } from "../store/redux/hooks";
import { hideNewEdgeDialog } from "../store/redux/uiSlice";

export const NewEdgeDialog = ({ open }: { open: boolean }) => {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();

  const causeNode = useAppSelector(state => state.ui.selectedNode); 
  
  const submitDisabled = () => {
    return selectedValue === null;
  }

  const submitForm = async () => {
    await apiClient.addEdge(causeNode, selectedValue!);
    dispatch(hideNewEdgeDialog());
  };

  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [stringRepresentations, setStringRepresentations] = useState<string[]>([]);
  
  useEffect(() => {
    apiClient.getListOfStringRepresentations().then((data) => {
      setStringRepresentations(data);
    });

    // eslint-disable-next-line
  }, [])
  
  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Add New Edge</DialogTitle>
        <DialogContent>
          <DialogContentText style={{marginBottom: '20px'}}>
            Enter the string representation of the node you want to connect to.
          </DialogContentText>
  
          <Autocomplete
            fullWidth
            options={stringRepresentations}
            autoHighlight
            renderInput={(params) => (
              <TextField
                autoFocus
                {...params}
                label="Choose an Effect"
              />
            )}
            onChange={(event, value) => setSelectedValue(value)}
          />

          
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(hideNewEdgeDialog())}>Cancel</Button>
          <Button disabled={submitDisabled()} onClick={submitForm}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
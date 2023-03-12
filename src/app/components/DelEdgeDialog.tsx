import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material"
import { useApiClient } from "../hooks/useApiClient";
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { hideDelEdgeDialog } from "../store/uiSlice";

export const DelEdgeDialog = ({ open }: { open: boolean }) => {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  
  const deletedEdgeSource = useAppSelector(state => state.ui.deletedEdgeSource);
  const deletedEdgeTarget = useAppSelector(state => state.ui.deletedEdgeTarget);
  
  const deleteEdge = async () => {
    await apiClient.deleteEdge(deletedEdgeSource, deletedEdgeTarget);
    dispatch(hideDelEdgeDialog());
  }
  
  return (
    <Dialog open={open}>
        <DialogTitle>
          Delete Edge?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => dispatch(hideDelEdgeDialog())}>No</Button>
          <Button onClick={deleteEdge} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
  )
}
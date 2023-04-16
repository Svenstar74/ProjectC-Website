import { Fab, Tooltip } from "@mui/material"
import GroupWorkOutlinedIcon from '@mui/icons-material/GroupWorkOutlined';
import { useContext, useState } from "react";
import { AppContext } from "../store/context/AppContext";
import { useAppDispatch, useAppSelector } from "../store/redux/hooks";
import { setSummaryNodesVisible } from "../store/redux/slices/toolSlice";

function Viewbar() {
  const { globalSigmaInstance } = useContext(AppContext);
  const dispatch = useAppDispatch();
  const allSummaryNodes = useAppSelector(state => state.data.allSummaryNodes);

  const summaryNodesShown = useAppSelector(state => state.tool.summaryNodesVisible);

  async function toggleSummaryNodes() { 
    if (!summaryNodesShown) {
      allSummaryNodes.forEach(node => {
        // Hide climate concept nodes
        node.combinedNodes.forEach(id =>
          globalSigmaInstance?.getGraph().setNodeAttribute(id, 'hidden', true)
        );
      
        // Bring back summary nodes
        globalSigmaInstance?.getGraph().setNodeAttribute(node.id, 'hidden', false);

      });

      dispatch(setSummaryNodesVisible(true));
    } else {
      allSummaryNodes.forEach(node => {
        // Hide summary nodes
        globalSigmaInstance?.getGraph().setNodeAttribute(node.id, 'hidden', true);

        // Bring back climate concept nodes
        node.combinedNodes.forEach(id =>
          globalSigmaInstance?.getGraph().setNodeAttribute(id, 'hidden', false)
        );
      });

      dispatch(setSummaryNodesVisible(false));
    }
  }
  
  return (
    <Tooltip title={summaryNodesShown ? 'Show Individual Nodes' : 'Show Group Nodes'}>
      <Fab
        size='small'
        style={{ background: summaryNodesShown ? 'lightgray' : 'white' }}
        onClick={toggleSummaryNodes}
      >
        <GroupWorkOutlinedIcon />
      </Fab>
    </Tooltip>
  );
}

export default Viewbar;

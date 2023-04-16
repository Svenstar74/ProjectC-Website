import { useState } from 'react';

import { Fab, Tooltip } from '@mui/material';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import GroupWorkOutlinedIcon from '@mui/icons-material/GroupWorkOutlined';

import { useAppDispatch, useAppSelector } from '../store/redux/hooks';
import { setActiveSelection, setTool } from '../store/redux/slices/toolSlice';
import useApiClient from '../hooks/useApiClient';

function Toolbar() {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const activeSelection = useAppSelector((state) => state.tool.activeSelection);
  const [selectedTool, setSelectedTool] = useState(0);
  
  function groupSelectedNodes() {
    const newNodes = activeSelection.map(node => node.climateConceptId);
    const x = activeSelection.reduce((accumulator, currentValue) => accumulator + currentValue.x, 0) / activeSelection.length;
    const y = activeSelection.reduce((accumulator, currentValue) => accumulator + currentValue.y, 0) / activeSelection.length;
    
    apiClient.addSummaryNode(newNodes, x, y);
    dispatch(setActiveSelection([]));
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      <Tooltip title="Move">
        <Fab
          size="small"
          style={{
            background: selectedTool === 0 ? 'lightgrey' : 'white',
            marginBottom: '10px',
          }}
          onClick={() => {
            setSelectedTool(0);
            dispatch(setTool(0));
          }}
        >
          <OpenWithIcon />
        </Fab>
      </Tooltip>

      <div>
        <Tooltip title="Rectangular Selection">
          <Fab
            size="small"
            style={{
              background: selectedTool === 1 ? 'lightgrey' : 'white',
              marginBottom: '10px',
            }}
            onClick={() => {
              setSelectedTool(1);
              dispatch(setTool(1));
            }}
          >
            <HighlightAltIcon />
          </Fab>
        </Tooltip>

        {activeSelection.length > 1 && <Tooltip title="Group Selected Nodes">
          <Fab
            size="small"
            style={{
              background: 'white',
              marginBottom: '10px',
              position: 'absolute',
              right: 50,
            }}
            onClick={groupSelectedNodes}
          >
            <GroupWorkOutlinedIcon />
          </Fab>
        </Tooltip>}
      </div>
    </div>
  );
}

export default Toolbar;

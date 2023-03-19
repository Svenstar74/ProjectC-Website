import { useState } from 'react';
import { ButtonGroup, Fab } from '@mui/material';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';

import { useAppDispatch } from '../store/redux/hooks';
import { setTool } from '../store/redux/toolSlice';

export const Toolbar = () => {
  const dispatch = useAppDispatch();
  const [selectedTool, setSelectedTool] = useState(0);

  const buttons = [<OpenWithIcon />, <HighlightAltIcon />];

  return (
    <ButtonGroup orientation="vertical">
      {buttons.map((button, index) => {
        return (
          <Fab
            key={index}
            size="small"
            style={{
              background: selectedTool === index ? 'lightgrey' : 'white',
              marginBottom: '10px',
            }}
            onClick={() => {
              setSelectedTool(index);
              dispatch(setTool(index));
            }}
          >
            {button}
          </Fab>
        );
      })}
    </ButtonGroup>
  );
};

import { ButtonGroup, Fab } from "@mui/material"
import OpenWithIcon from '@mui/icons-material/OpenWith';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';

import { useState } from "react";

export const Toolbar = () => {
  const [selectedTool, setSelectedTool] = useState(0);
  
  const buttons = [<OpenWithIcon />, <HighlightAltIcon />];
  
  return (
    <ButtonGroup orientation='vertical'>
      {buttons.map((button, index) => {
        return (
          <Fab
            key={index}
            size='small'
            style={{
              background: selectedTool === index ? 'lightgrey' : 'white',
              marginBottom: '10px',
            }}
            onClick={() => setSelectedTool(index)}
            >
              {button}
          </Fab>)
        })}
    </ButtonGroup>
  )
}
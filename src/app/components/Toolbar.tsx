import { ButtonGroup, IconButton } from "@mui/material"
import OpenWithIcon from '@mui/icons-material/OpenWith';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';

import classes from './Toolbar.module.css';
import { useState } from "react";

export const Toolbar = () => {
  const [selectedTool, setSelectedTool] = useState(0);
  
  const buttons = [<OpenWithIcon />, <HighlightAltIcon />];
  
  return (
    <ButtonGroup orientation='vertical'>
      {buttons.map((button, index) => {
        return (
          <IconButton
            className={classes.imageButton}
            style={{background: selectedTool === index ? 'lightgrey' : 'white'}}
            onClick={() => setSelectedTool(index)}
            >
              {button}
          </IconButton>)
        })}
    </ButtonGroup>
  )
}
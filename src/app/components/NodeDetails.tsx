import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, IconButton, Tab, Tabs, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import classes from './NodeDetails.module.css';
import { useState } from 'react';

export const NodeDetails = () => {
  const [needsReview, setNeedsReview] = useState(false);
  const [needsCorrection, setNeedsCorrection] = useState(false);
  
  const shortDescription = `And once international scientists had eliminated the effect of temperature averages across the whole growing season, they still found that heatwaves, drought and torrential downfall accounted for 18% to 43% of losses.\n`;

  return (
    <div className={classes.container}>
      <h2 className={classes.heading}>increase_[]_crop_losses</h2>
      <IconButton className={classes.icon}>
        <EditIcon />
      </IconButton>

      <br />
      <span>Id: 310771246</span>
      
      <Chip
        label="Needs Review"
        variant="filled"
        style={{marginLeft: "10px"}}
        color={needsReview ? "primary" : "default"}
        size="small"
        onClick={() => setNeedsReview(prev => !prev)}
      />

      <Chip
        label="Needs Correction"
        variant="filled"
        style={{marginLeft: "10px"}}
        color={needsCorrection ? "error" : "default"}
        size="small"
        onClick={() => setNeedsCorrection(prev => !prev)}
      />

      <TextField
        fullWidth
        multiline
        variant="outlined"
        size="small"
        label="Short Description"
        defaultValue={shortDescription}
        style={{ marginTop: '30px' }}
      />

      <Accordion style={{marginTop: "20px"}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>Sources</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion style={{marginTop: "20px"}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>Connections</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion style={{marginTop: "20px"}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>Comments</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion style={{marginTop: "20px"}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>History</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>

    </div>
  )
};
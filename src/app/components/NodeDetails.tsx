import { useState } from 'react';

import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, CardHeader, Chip, Link, List, ListItem, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const NodeDetails = () => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [needsReview, setNeedsReview] = useState(false);
  const [needsCorrection, setNeedsCorrection] = useState(false);

  const shortDescription = `And once international scientists had eliminated the effect of temperature averages across the whole growing season, they still found that heatwaves, drought and torrential downfall accounted for 18% to 43% of losses.\n`;
  
  return (
    <Card sx={{ width: 400 }}>

      <CardHeader
        action={
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        }
        title="increase_[]_crop_losses"
        titleTypographyProps={{ variant: "body1" }}
        subheader="ID 310771246"
        subheaderTypographyProps={{ variant: "body2" }}
      />

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          
        <Chip
          label="Needs Review"
          size="small"
          onClick={() => setNeedsReview(prev => !prev)}
          style={{
            marginBottom: "25px", marginRight: "10px",
            background: needsReview ? "#006080" : "#eee",
            color: needsReview ? "white" : "black" 
          }}
        />
        
        <Chip
          label="Needs Correction"
          size="small"
          onClick={() => setNeedsCorrection(prev => !prev)}
          style={{
            marginBottom: "25px",
            background: needsCorrection ? "#801a00" : "#eee",
            color: needsCorrection ? "white" : "black"
          }}
        />

        <TextField
          fullWidth
          multiline
          variant="outlined"
          size="small"
          label="Short Description"
          defaultValue={shortDescription}
        />

        <Accordion style={{marginTop: "20px"}}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>Sources</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              <ListItem>
                <Link
                  rel="noopener noreferrer" target="_blank"
                  href="https://physicsworld.com/a/crops-at-risk-from-changing-climate/"
                >
                  https://physicsworld.com/a/crops-at-risk-from-changing-climate/
                </Link>
              </ListItem>
            </List>
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
          
        </CardContent>
      </Collapse>
    </Card>
  );
}
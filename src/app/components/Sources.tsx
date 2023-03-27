import { Accordion, AccordionDetails, AccordionSummary, Button, List, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Source } from './Source';

export const Sources = () => {
  return (
    <Accordion style={{ marginTop: '20px' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Sources</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Button
          fullWidth
          variant="outlined"
        >
          Add new Source
        </Button>
        
        <List dense>
          <Source url="https://physicsworld.com/a/crops-at-risk-from-changing-climate/" originalText="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet." />
          <Source url="https://physicsworld.com/a/crops-at-risk-from-changing-climate/" originalText="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet." />
          <Source url="https://physicsworld.com/a/crops-at-risk-from-changing-climate/" originalText="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet." />
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

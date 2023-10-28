import { useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Divider, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSigma } from "@react-sigma/core";
import { allSimpleEdgePaths } from "graphology-simple-path";

interface Props {
  id: string;
}

function Paths({ id }: Props) {
  const sigma = useSigma();

  const [paths, setPaths] = useState<string[][]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const gasEmissionsNodeId = '724883391';

  function handleListItemClick(index: number) {
    if (index === selectedIndex) {
      setSelectedIndex(null);
      sigma.setSetting('edgeReducer', null);
    } else {
      setSelectedIndex(index);
      sigma.setSetting('edgeReducer', (edge, data) => {
        if (index === selectedIndex) {
          return data;
        }

        if (paths[index].includes(edge)) {
          data.color = '#f00';
          data.hidden = false;
          return data;
        }

        data.color = '#cbcbcb';
        return data;
      });
    }
  }

  useEffect(() => {
    const paths = allSimpleEdgePaths(sigma.getGraph(), gasEmissionsNodeId, id);
    setPaths(paths);
  }, [sigma, id]);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Paths ({paths.length})</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          <Divider />
          {paths.map((path, index) => (
            <div key={index}>
              <ListItemButton selected={selectedIndex === index} onClick={() => handleListItemClick(index)}>
                <ListItemText>Path #{index + 1}</ListItemText>
              </ListItemButton>
              <Divider />
            </div>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}

export default Paths;

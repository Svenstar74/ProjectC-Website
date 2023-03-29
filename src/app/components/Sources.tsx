import { FC, useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, List, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useApiClient } from '../hooks/useApiClient';
import { NewSource } from './NewSource';
import { Source } from './Source';

interface Props {
  climateConceptId: string;
  sources: { url: string; originalText: string }[];
}

export const Sources: FC<Props> = ({ climateConceptId, sources }) => {
  const apiClient = useApiClient();

  const [sourceList, setSourceList] = useState(sources);
  const [showNewSource, setShowNewSource] = useState(false);

  function addSource(url: string, originalText: string) {
    if (url === '' || originalText === '') {
      return;
    }

    apiClient.addSource(climateConceptId, url, originalText);
    setSourceList((current) => [...current, { url, originalText }]);

    setShowNewSource(false);
  }

  function deleteSource(
    climateConceptId: string,
    url: string,
    originalText: string
  ) {
    apiClient.deleteSource(climateConceptId, url, originalText);
    setSourceList((current) =>
      current.filter(
        (source) => source.url !== url && source.originalText !== originalText
      )
    );
  }

  useEffect(() => {
    setSourceList(sources);
  }, [sources]);

  return (
    <Accordion defaultExpanded style={{ marginTop: '20px' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Sources</Typography>
      </AccordionSummary>
      <AccordionDetails>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => setShowNewSource((prev) => !prev)}
        >
          Add new Source
        </Button>

        {showNewSource && <NewSource onAddSource={addSource} />}

        <List dense>
          {sourceList.map((source, index) => (
            <Source
              key={index}
              climateConceptId={climateConceptId}
              url={source.url}
              originalText={source.originalText}
              onDeleteSource={deleteSource}
            />
          ))}
        </List>
        
      </AccordionDetails>
    </Accordion>
  );
};

import { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, List, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import NewSource from './NewSource';
import Source from './Source';
import useApiClient from '../../../../components/hooks/useApiClient';
import { useAppSelector } from '../../../../store/redux/hooks';

interface Props {
  id: string;
  endpoint: '/climate-concept-nodes' | '/connections';
  sources: { url: string; originalText: string }[];
}

function Sources({ id, endpoint, sources }: Props) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const apiClient = useApiClient();

  const [sourceList, setSourceList] = useState(sources);
  const [showNewSource, setShowNewSource] = useState(false);

  function addSource(url: string, originalText: string) {
    if (url === '' || originalText === '') {
      return;
    }

    apiClient.addSource(id, url, originalText, endpoint)
      .then(() => {
        setSourceList((current) => [...current, { url, originalText }]);
      });
        
    setShowNewSource(false);
  }

  function deleteSource(
    climateConceptId: string,
    url: string,
    originalText: string,
  ) {
    apiClient.deleteSource(climateConceptId, url, originalText, endpoint);

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
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Sources</Typography>
      </AccordionSummary>
      <AccordionDetails>

        {isLoggedIn &&
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setShowNewSource((prev) => !prev)}
          >
            Add new Source
          </Button>
        }

        {showNewSource && <NewSource onAddSource={addSource} />}

        <List dense>
          {sourceList.map((source) => (
            <Source
              key={source.url + source.originalText}
              id={id}
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

export default Sources;

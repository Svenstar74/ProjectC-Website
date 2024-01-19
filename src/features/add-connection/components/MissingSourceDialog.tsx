import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

import { eventBus } from "../../../eventBus";
import useCreateConnection from "../hooks/useCreateConnection";
import useApiClient from "../../../components/hooks/useApiClient";

function MissingSourceDialog() {
  const apiClient = useApiClient();
  const { createConnection } = useCreateConnection();

  const [open, setOpen] = useState(false);
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');

  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceOriginalText, setSourceOriginalText] = useState('');

  async function handleCreateConnection() {
    const result = await createConnection(
      sourceId,
      targetId,
      'contributesTo',
      [{ url: sourceUrl, originalText: sourceOriginalText }],
    );

    if (result) {
      apiClient.addSource(sourceId, sourceUrl, sourceOriginalText, '/climate-concept-nodes');
      apiClient.addSource(targetId, sourceUrl, sourceOriginalText, '/climate-concept-nodes');
    }

    setOpen(false);
  }

  useEffect(() => {
    eventBus.on('addMissingSource', (data) => {
      setSourceId(data.startNode);
      setTargetId(data.endNode);
      setOpen(true);
    });
  
    return () => {
      eventBus.off('addMissingSource');
    };
  }, []);

  useEffect(() => {
    setSourceUrl('');
    setSourceOriginalText('');
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogTitle>Missing Source...</DialogTitle>

      <DialogContent>
        <DialogContentText marginBottom={5}>
          To create a 'contributes to' connection between two nodes, it
          is necessary for both nodes to have an identical source. Please
          create this source below and it will automatically be added two
          the two nodes and the connection that will be created.
        </DialogContentText>

        <TextField
          fullWidth
          variant="outlined"
          label="Link"
          placeholder="https://example.com"
          style={{ verticalAlign: 'middle', marginBottom: '20px' }}
          value={sourceUrl}
          onChange={(event) => setSourceUrl(event.target.value)}
        />

        <TextField
          fullWidth
          multiline
          variant="outlined"
          label="Original Text"
          placeholder='The text that was originally on the website'
          value={sourceOriginalText}
          onChange={(event) => setSourceOriginalText(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleCreateConnection} disabled={!sourceUrl || !sourceOriginalText}>Create Connection</Button>
      </DialogActions>
    </Dialog>
  );
}

export default MissingSourceDialog;

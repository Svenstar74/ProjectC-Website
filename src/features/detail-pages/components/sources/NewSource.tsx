import { useState } from 'react';
import { IconButton, TextField, Tooltip } from '@mui/material';
import { Add, ContentPaste } from '@mui/icons-material';

import { useToastMessage } from 'src/shared';

interface Props {
  onAddSource: (url: string, originalText: string) => void;
}

function NewSource({ onAddSource }: Props) {
  const { showToast } = useToastMessage();

  const [url, setUrl] = useState('');
  const [originalText, setOriginalText] = useState('');

  async function onPasteSource() {
    const clipboardContents = await navigator.clipboard.read();
    
    try {
      const clipboardContent = await clipboardContents[0].getType('text/html');
      const clipboardJSON = await JSON.parse(await clipboardContent.text());

      if (clipboardJSON.url === undefined || clipboardJSON.originalText === undefined) {
        throw new Error('No source found in clipboard');
      }

      setUrl(clipboardJSON.url);
      setOriginalText(clipboardJSON.originalText);
    } catch (error) {
      showToast('No source found in clipboard', 'error');
    }
  }

  function addSource() {
    setUrl('');
    setOriginalText('');

    onAddSource(url, originalText);
  }

  return (
    <div
      style={{
        marginBottom: '30px',
        padding: '20px 10px',
        paddingBottom: '50px',
        border: '1px solid lightgray',
        borderRadius: '5px',
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        label="Link"
        placeholder="https://example.com"
        style={{ verticalAlign: 'middle', marginBottom: '20px' }}
        value={url}
        onChange={(event) => setUrl(event.target.value)}
      />

      <TextField
        fullWidth
        multiline
        variant="outlined"
        label="Original Text"
        placeholder='The text that was originally on the website'
        value={originalText}
        onChange={(event) => setOriginalText(event.target.value)}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
        <Tooltip title="Paste Source">
          <span>
            <IconButton onClick={onPasteSource}>
              <ContentPaste />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Add Source" style={{ float: 'right' }}>
          <span>
            <IconButton onClick={addSource} disabled={url === '' || originalText === ''}>
              <Add />
            </IconButton>
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export default NewSource;

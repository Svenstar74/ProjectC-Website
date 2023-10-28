import { useState } from 'react';
import { IconButton, TextField, Tooltip } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import DeleteIcon from '@mui/icons-material/Delete';

import ConfirmDialog from '../../../../components/dialogs/ConfirmDialog';
import { useAppSelector } from '../../../../store/redux/hooks';

interface Props {
  id: string;
  url: string;
  originalText: string;
  onDeleteSource: (
    id: string,
    url: string,
    originalText: string
  ) => void;
}

function Source({
  id,
  url,
  originalText,
  onDeleteSource,
}: Props) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  function confirmDeleteSource() {
    setShowConfirmDialog(false);
    onDeleteSource(id, url, originalText)
  }

  return (
    <>
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
          value={url}
          style={{ verticalAlign: 'middle', marginBottom: '20px' }}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <IconButton onClick={() => window.open(url, '_blank', 'noreferrer')} style={{ marginLeft: '20px' }}>
                <LaunchIcon />
              </IconButton>
            ),
          }}
        />

        <TextField
          fullWidth
          multiline
          variant="outlined"
          label="Original Text"
          value={originalText}
          InputProps={{
            readOnly: true,
          }}
        />

        {isLoggedIn &&
          <Tooltip title="Delete Source" style={{ float: 'right' }}>
            <span>
              <IconButton onClick={() => setShowConfirmDialog(true)}>
                <DeleteIcon/>
              </IconButton>
            </span>
          </Tooltip>
        }
      </div>

      <ConfirmDialog
        open={showConfirmDialog}
        onCancel={() => setShowConfirmDialog(false)}
        onConfirm={confirmDeleteSource}
        content={
          <>
            <span>Are you sure you want to delete this source?</span><br/>
            <span>This action cannot be undone.</span>
          </>
        }
        confirmBtnText="Yes"
      />
    </>
  );
};

export default Source;

import { FC } from 'react';
import { IconButton, TextField, Tooltip } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  url: string;
  originalText: string;
}

export const Source: FC<Props> = ({ url, originalText }) => {
  const openLink = () => {
    window.open(url, '_blank', 'noreferrer');
  };

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
        defaultValue={url}
        style={{ verticalAlign: 'middle', marginBottom: '20px' }}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <IconButton onClick={openLink} style={{ marginLeft: '20px' }}>
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
        defaultValue={originalText}
        InputProps={{
          readOnly: true,
        }}
      />

      <Tooltip title="Delete Source" style={{ float: 'right' }}>
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

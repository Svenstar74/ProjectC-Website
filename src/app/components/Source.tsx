import { FC } from 'react';
import { IconButton, TextField, Tooltip } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  climateConceptId: string;
  url: string;
  originalText: string;
  onDeleteSource: (
    climateConceptId: string,
    url: string,
    originalText: string
  ) => void;
}

export const Source: FC<Props> = ({
  climateConceptId,
  url,
  originalText,
  onDeleteSource,
}) => {
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
        value={url}
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
        value={originalText}
        InputProps={{
          readOnly: true,
        }}
      />

      <Tooltip title="Delete Source" style={{ float: 'right' }}>
        <IconButton>
          <DeleteIcon
            onClick={() => onDeleteSource(climateConceptId, url, originalText)}
          />
        </IconButton>
      </Tooltip>
    </div>
  );
};

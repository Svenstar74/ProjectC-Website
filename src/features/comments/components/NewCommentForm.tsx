import { useState } from 'react';
import { FormControl, FormHelperText, IconButton, Input, Tooltip } from '@mui/material';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

import { useAddComment } from '../hooks';

interface Props {
  referenceId: string;
  userName: string;
}

function NewCommentForm({ referenceId, userName }: Props) {
  const [newCommentText, setNewCommentText] = useState('');

  const addCommentMutation = useAddComment(referenceId);

  // Pressing CTRL + Enter submits the comment as well
  function handleKeyPress(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.ctrlKey && event.key === 'Enter') {
      addCommentHandler();
    }
  }

  function addCommentHandler() {
    setNewCommentText('');

    addCommentMutation.mutate(
      {
        referenceId,
        text: newCommentText,
        createdBy: userName,
      },
      {
        onError: () => {
          setNewCommentText(newCommentText);
        }
      }
    );
  }

  return (
    <FormControl variant='standard' fullWidth style={{ marginBottom: 20 }}>
      <Input
        placeholder='Add a comment...'
        multiline
        value={newCommentText}
        onChange={(event) => {
          setNewCommentText(event.target.value);
          addCommentMutation.reset();
        }}
        onKeyDown={handleKeyPress}
      />
      <FormHelperText error>{addCommentMutation.isError ? 'An error occurred, please try again.' : ''}</FormHelperText>
      
      <div style={{ marginLeft: 'auto' }}>
        <Tooltip title='Add Comment'>
          <span>
            <IconButton
              edge='end'
              onClick={addCommentHandler}
              disabled={newCommentText.trim() === ''}
              style={{ transform: 'rotate(90deg)' }}
            >
              <ArrowCircleRightIcon />
            </IconButton>
          </span>
        </Tooltip>
      </div>
    </FormControl>
  );
}

export default NewCommentForm;

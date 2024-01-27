import { useEffect, useState } from "react";
import { FormControl, FormHelperText, IconButton, Input, Tooltip } from "@mui/material";
import { ArrowCircleRight, Close } from "@mui/icons-material";

import useUpdateComment from "../hooks/useUpdateComment";

interface Props {
  referenceId: string;
  id: string;
  initialText: string;
  onFinish: () => void;
}

function UpdateCommentForm({ referenceId, id, initialText, onFinish }: Props) {
  const updateCommentMutation = useUpdateComment(referenceId);
  const [text, setText] = useState(initialText);

  // Pressing CTRL + Enter submits the comment as well
  function handleKeyPress(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.ctrlKey && event.key === 'Enter') {
      addCommentHandler();
    }
  }

  function addCommentHandler() {
    setText('');

    updateCommentMutation.mutate(
      { id, text: text },
      {
        onError: () => {
          setText(text);
        }
      }
    );

    onFinish();
  }

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  return (
    <FormControl variant='standard' fullWidth style={{ marginBottom: 20 }}>
      <Input
        multiline
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          updateCommentMutation.reset();
        }}
        onKeyDown={handleKeyPress}
      />
      <FormHelperText error>{updateCommentMutation.isError ? 'An error occurred, please try again.' : ''}</FormHelperText>

      <div style={{ marginLeft: 'auto' }}>
        <Tooltip title='Cancel'>
          <IconButton onClick={onFinish}>
            <Close />
          </IconButton>
        </Tooltip>

        <Tooltip title='Update Comment'>
          <span>
            <IconButton
              edge='end'
              onClick={addCommentHandler}
              disabled={text.trim() === ''}
              style={{ transform: 'rotate(0deg)' }}
            >
              <ArrowCircleRight />
            </IconButton>
          </span>
        </Tooltip>
      </div>
    </FormControl>
  );
}

export default UpdateCommentForm;

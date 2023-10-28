import { useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Button, List, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { IComment } from "business-logic";

import { useAppSelector } from "../../../../store/redux/hooks";
import useApiClient from "../../../../components/hooks/useApiClient";
import Comment from "./Comment";

interface Props {
  id: string;
  comments: IComment[];
}

function Comments({ id, comments }: Props) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const apiClient = useApiClient();

  const [commentList, setCommentList] = useState(comments);
  const [newCommentText, setNewCommentText] = useState('');

  // Custom comparator function to compare dates
  function compareCreatedAt(a: IComment, b: IComment): number {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    // Compare the dates, with the most recent date first
    if (dateA > dateB) {
      return -1;
    } else if (dateA < dateB) {
      return 1;
    } else {
      return 0;
    }
  }

  function addComment() {
    if (newCommentText.trim() === '') {
      return;
    }

    apiClient.createComment(id, newCommentText)
      .then((result) => {
        setCommentList((current) => [...current, result]);
      });

    setNewCommentText('');
  }

  useEffect(() => {
    setCommentList(comments);
  }, [comments]);

  return (
    <Accordion style={{ marginTop: '20px' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Comments</Typography>
      </AccordionSummary>

      <AccordionDetails>
        {isLoggedIn && <>
          <TextField
            fullWidth
            multiline
            label="Add a comment"
            variant="outlined"
            value={newCommentText}
            onChange={(event) => setNewCommentText(event.target.value)}
          />
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={addComment}
            style={{ marginTop: '10px' }}
          >
            Add
          </Button>
        </>}
        
        <List dense>
          {commentList.sort(compareCreatedAt).map((comment) => (
            <li key={comment.id} style={{ marginBottom: 10 }}>
              <Comment {...comment} />
            </li>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}

export default Comments;

import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useFetchComments } from '../hooks';
import CommentList from './CommentList';
import NewCommentForm from './NewCommentForm';

interface Props {
  referenceId: string;
  userIsAuthorized: boolean;
  userName: string;
}

function CommentAccordion({ referenceId, userIsAuthorized, userName }: Props) {
  const { data } = useFetchComments(referenceId);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <p style={{ padding: 0, margin: 0 }}>Comments</p>
        <div style={{ marginLeft: 10 }}>({data ? data.length : 0})</div>
      </AccordionSummary>
      <AccordionDetails>
        {userIsAuthorized && <NewCommentForm referenceId={referenceId} userName={userName} />}
        <CommentList referenceId={referenceId} comments={data || []} userIsAuthorized={userIsAuthorized} />
      </AccordionDetails>
    </Accordion>
  );
}

export default CommentAccordion;

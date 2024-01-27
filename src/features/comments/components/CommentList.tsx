import { useState } from 'react';
import { createPortal } from 'react-dom';
import { comments } from 'business-logic';

import { useDeleteComment } from '../hooks';
import SingleComment from './SingleComment';
import DeleteCommentDialog from './DeleteCommentDialog';

interface Props {
  referenceId: string;
  comments: comments.CommentEntity[];
  userIsAuthorized: boolean;
}

function CommentList({ comments, referenceId, userIsAuthorized }: Props) {
  const deleteCommentMutation = useDeleteComment(referenceId);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  function handleDeleteComment() {
    deleteCommentMutation.mutate(commentToDelete);
    setCommentToDelete(null);
  }

  return (
    <>
      {comments.map((comment) => (
        <div key={comment.id} style={{ marginBottom: 20 }}>
          <SingleComment referenceId={referenceId} {...comment} onDelete={(id) => setCommentToDelete(id)} userIsAuthorized={userIsAuthorized} />
        </div>
      ))}

      {createPortal(
        <DeleteCommentDialog open={commentToDelete !== null} onClose={() => setCommentToDelete(null)} onDelete={handleDeleteComment} />,
        document.body
      )}
    </>
  );
}

export default CommentList;

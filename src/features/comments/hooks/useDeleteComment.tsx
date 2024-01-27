import { useMutation, useQueryClient } from '@tanstack/react-query';
import { comments } from 'business-logic';

import { deleteComment } from '../api';

/**
 * Custom React hook that deletes a comment from the database using optimistic updates
 * @param referenceId The id of the node / connection the comment belongs to
 * @returns React Query mutation object
 */
function useDeleteComment(referenceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onMutate: async (id: string) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['comments', referenceId],
      });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData(['comments', referenceId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['comments', referenceId], (old: comments.CommentEntity[] | undefined) => {
        if (old) {
          return old.filter((comment) => comment.id !== id);
        }

        return [];
      });

      // Return a context object with the snapshotted value
      return { previousComments };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_, __, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', referenceId], context.previousComments);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', referenceId],
      });
    },
  });
}

export default useDeleteComment;

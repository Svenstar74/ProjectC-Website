import { useMutation, useQueryClient } from "@tanstack/react-query";

import { comments } from "business-logic";
import { updateComment } from "../api";

/**
 * Custom React hook that updates a comments text in the database using optimistic updates
 * @param referenceId The id of the reference the comment belongs to
 * @returns React Query mutation object
 */
function useUpdateComment(referenceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: { id: string; text: string }) =>
      updateComment(comment.id, comment.text),
    onMutate: async (newComment: { id: string; text: string }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["comments", referenceId] });

      // Snapshot the previous value
      const previousComments: comments.CommentEntity[] = queryClient.getQueryData([
        "comments",
        newComment.id,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["comments", referenceId], (old: comments.CommentEntity[]) => {
        return old.map((c) => {
          if (c.id === newComment.id) {
            return { ...c, text: newComment.text };
          }
          return c;
        });
      });

      // Return a context object with the snapshotted value
      return { previousComments };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_, __, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", referenceId],
          context.previousComments
        );
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ["comments", referenceId] });
    },
  });
}

export default useUpdateComment;

import { comments } from "business-logic";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function fetchComments(referenceId: string): Promise<comments.CommentEntity[]> {
  const response = await fetch(BASE_URL + `/comments/reference/${referenceId}`);

  if (!response.ok) {
    throw new Error('Could not fetch comments');
  }

  const data = await response.json();

  return data.data;
}

export default fetchComments;

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function deleteComment(id: string) {
  const response = await fetch(BASE_URL + `/comments/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Could not delete comment');
  }
}

export default deleteComment;

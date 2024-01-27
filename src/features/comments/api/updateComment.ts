const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function updateComment(id: string, text: string) {
  const response = await fetch(BASE_URL + '/comments/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('Could not update comment');
  }
}

export default updateComment;

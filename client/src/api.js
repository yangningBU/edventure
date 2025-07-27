const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:3002';

export const generateQuestions = async (prompt, lang) => {
  const endpoint = `${API_HOST}/generate-questions`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, lang }),
  });
  return response;
}
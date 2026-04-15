const API_URL = 'http://localhost:3000';

export async function request(path: string, options?: RequestInit) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error('Erro na requisição');
  }

  return res.json();
}
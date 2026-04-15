import { request } from './api';

export function login(email: string, senha: string) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
}
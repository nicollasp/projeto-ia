import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RotaProtegida({ children }: any) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}
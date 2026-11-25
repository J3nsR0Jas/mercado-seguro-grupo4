import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RutaProtegida({ modulo, roles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="loading">Comprobando sesión...</p>;
  if (!user) return <Navigate to={modulo ? `/login?modulo=${modulo}` : '/login'} replace state={{ from: location.pathname }} />;
  const allowed = !modulo || user.roles.some((entry) => entry.modulo === modulo && roles.includes(entry.rol));
  if (!allowed) return <Navigate to="/" replace />;
  return <Outlet />;
}

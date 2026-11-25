import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const roleNames = {
  cliente: 'Cliente',
  empleado: 'Empleado',
  administrador: 'Administrador'
};

const moduleNames = {
  mercado: 'Mercado',
  pnp: 'PNP',
  essalud: 'EsSalud'
};

export default function PerfilPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function signOut() {
    logout();
    navigate('/', { replace: true });
  }

  return (
    <section className="profile-card">
      <p className="eyebrow">CUENTA PERSONAL</p>
      <h1>Mi perfil</h1>
      <dl className="profile-details">
        <div><dt>Nombre completo</dt><dd>{user.nombre}</dd></div>
        <div><dt>Correo electrónico</dt><dd>{user.correo}</dd></div>
        <div>
          <dt>Rol asignado</dt>
          <dd>{user.roles.map((role) => `${moduleNames[role.modulo] || role.modulo}: ${roleNames[role.rol] || role.rol}`).join(' · ')}</dd>
        </div>
        <div><dt>Estado de cuenta</dt><dd><span className="profile-status">Activa</span></dd></div>
      </dl>
      <div className="profile-actions">
        <Link className="button button-secondary" to="/">Volver al inicio</Link>
        <button className="button button-quiet" onClick={signOut}>Cerrar sesión</button>
      </div>
    </section>
  );
}

import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const entries = [
  { module: 'mercado', role: 'cliente', path: '/mercado', label: 'Portal Mercado' },
  { module: 'mercado', role: 'empleado', path: '/mercado', label: 'Portal Mercado' },
  { module: 'mercado', role: 'administrador', path: '/mercado', label: 'Portal Mercado' },
  { module: 'mercado', role: 'cliente', path: '/mercado/mi-puesto', label: 'Mi puesto' },
  { module: 'mercado', role: 'cliente', path: '/mercado/registro', label: 'Registrar puesto' },
  { module: 'mercado', role: 'empleado', path: '/mercado/registros', label: 'Puestos' },
  { module: 'mercado', role: 'administrador', path: '/mercado/seguridad', label: 'Seguridad' },
  { module: 'pnp', role: 'cliente', path: '/pnp', label: 'Portal PNP' },
  { module: 'pnp', role: 'empleado', path: '/pnp', label: 'Portal PNP' },
  { module: 'pnp', role: 'cliente', path: '/pnp/denuncia', label: 'Denunciar incidente' },
  { module: 'pnp', role: 'cliente', path: '/pnp/mis-denuncias', label: 'Mis denuncias' },
  { module: 'pnp', role: 'empleado', path: '/pnp/panel', label: 'Panel PNP' },
  { module: 'essalud', role: 'cliente', path: '/essalud', label: 'Portal EsSalud' },
  { module: 'essalud', role: 'empleado', path: '/essalud', label: 'Portal EsSalud' },
  { module: 'essalud', role: 'cliente', path: '/essalud/cita', label: 'Solicitar cita' },
  { module: 'essalud', role: 'cliente', path: '/essalud/mis-citas', label: 'Mis citas' },
  { module: 'essalud', role: 'empleado', path: '/essalud/panel', label: 'Panel EsSalud' }
];

export default function MenuRoles() {
  const { user, logout } = useAuth();
  const visible = entries.filter((entry) =>
    user.roles.some((role) => role.modulo === entry.module && role.rol === entry.role)
  );

  return (
    <header className="topbar">
      <NavLink className="brand" to="/">Mercado <span>Seguro</span></NavLink>
      <nav aria-label="Módulos disponibles">
        {visible.map((entry) => (
          <NavLink key={entry.path} to={entry.path} className={({ isActive }) => isActive ? 'navlink active' : 'navlink'}>
            {entry.label}
          </NavLink>
        ))}
      </nav>
      <div className="account">
        <span>{user.nombre}</span>
        <button className="button button-quiet" onClick={logout}>Cerrar sesión</button>
      </div>
    </header>
  );
}

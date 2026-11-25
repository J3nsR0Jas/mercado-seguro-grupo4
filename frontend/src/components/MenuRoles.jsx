import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const modules = [
  {
    id: 'mercado',
    label: 'Mercado',
    links: [
      { path: '/mercado', label: 'Portal Mercado' },
      { path: '/mercado/mi-puesto', label: 'Mi puesto', roles: ['cliente'] },
      { path: '/mercado/registro', label: 'Registrar puesto', roles: ['cliente'] },
      { path: '/mercado/registros', label: 'Puestos', roles: ['empleado'] },
      { path: '/mercado/seguridad', label: 'Seguridad', roles: ['administrador'] }
    ]
  },
  {
    id: 'pnp',
    label: 'PNP',
    links: [
      { path: '/pnp', label: 'Portal PNP' },
      { path: '/pnp/denuncia', label: 'Denunciar incidente', roles: ['cliente'] },
      { path: '/pnp/mis-denuncias', label: 'Mis denuncias', roles: ['cliente'] },
      { path: '/pnp/panel', label: 'Panel PNP', roles: ['empleado'] }
    ]
  },
  {
    id: 'essalud',
    label: 'EsSalud',
    links: [
      { path: '/essalud', label: 'Portal EsSalud' },
      { path: '/essalud/cita', label: 'Solicitar cita', roles: ['cliente'] },
      { path: '/essalud/mis-citas', label: 'Mis citas', roles: ['cliente'] },
      { path: '/essalud/panel', label: 'Panel EsSalud', roles: ['empleado'] }
    ]
  }
];

export default function MenuRoles() {
  const { user, logout } = useAuth();
  const [openModule, setOpenModule] = useState(null);
  const menuRef = useRef(null);
  const location = useLocation();

  useEffect(() => setOpenModule(null), [location.pathname]);

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (!menuRef.current?.contains(event.target)) setOpenModule(null);
    }
    function closeOnEscape(event) {
      if (event.key === 'Escape') setOpenModule(null);
    }
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const availableModules = user
    ? modules.map((module) => {
      const roles = user.roles.filter((role) => role.modulo === module.id).map((role) => role.rol);
      return {
        ...module,
        roles,
        links: module.links.filter((link) => !link.roles || link.roles.some((role) => roles.includes(role)))
      };
    }).filter((module) => module.roles.length > 0)
    : [];

  return (
    <header className="topbar">
      <Link className="brand" to="/">Mercado <span>Seguro</span></Link>
      <nav className="module-nav" aria-label="Módulos disponibles" ref={menuRef}>
        {availableModules.map((module) => {
          const isActive = location.pathname === `/${module.id}` || location.pathname.startsWith(`/${module.id}/`);
          const isOpen = openModule === module.id;
          return (
            <div
              className={`module-dropdown${isActive ? ' active' : ''}${isOpen ? ' open' : ''}`}
              key={module.id}
              onMouseEnter={() => setOpenModule(module.id)}
              onMouseLeave={() => setOpenModule(null)}
            >
              <button
                className="module-dropdown-trigger"
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenModule(isOpen ? null : module.id)}
                onFocus={() => setOpenModule(module.id)}
              >
                {module.label} <span aria-hidden="true">▾</span>
              </button>
              <div className="module-dropdown-menu">
                {module.links.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === `/${module.id}`}
                    className={({ isActive: linkIsActive }) => linkIsActive ? 'dropdown-link active' : 'dropdown-link'}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>
      <div className="account">
        {user
          ? <>
            <span className="account-name">{user.nombre}</span>
            <Link className="button button-quiet profile-link" to="/perfil">Mi perfil</Link>
            <button className="button button-quiet" onClick={logout}>Cerrar sesión</button>
          </>
          : <Link className="button button-primary" to="/login">Iniciar sesión</Link>}
      </div>
    </header>
  );
}

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const modules = [
  { id: 'mercado', name: 'Mercado Mayorista', intro: 'Ubicación, trámites de puestos y servicios al comerciante.', path: '/mercado', color: 'market' },
  { id: 'pnp', name: 'Central de Emergencias PNP', intro: 'Servicios institucionales, denuncias y seguimiento.', path: '/pnp', color: 'police' },
  { id: 'essalud', name: 'EsSalud Norte Chico', intro: 'Atención, citas y servicios para asegurados.', path: '/essalud', color: 'health' }
];

export default function HomePage() {
  const { user } = useAuth();
  const accessible = modules.map((module) => {
    const roles = user.roles.filter((role) => role.modulo === module.id);
    return { ...module, roles };
  }).filter((module) => module.roles.length > 0);
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">PLATAFORMA INTEGRADA · GRUPO 4</p>
          <h1>Hola, {user.nombre}</h1>
          <p>Un mismo acceso conecta al comerciante, la PNP y EsSalud.</p>
        </div>
        <div className="hero-mark" aria-hidden="true">MS</div>
      </section>
      <section className="section">
        <div className="section-heading"><div><p className="eyebrow">TU MENÚ POR ROLES</p><h2>Servicios disponibles</h2></div></div>
        <div className="module-grid">
          {accessible.map((module) => {
            return <Link key={module.id} className={`module-card ${module.color}`} to={module.path}>
              <span className="module-icon">{module.id === 'mercado' ? '01' : module.id === 'pnp' ? '02' : '03'}</span>
              <h3>{module.name}</h3>
              <p>{module.intro}</p>
              <span className="role-tag">{module.roles.map((role) => role.rol).join(' · ')}</span>
              <span className="card-link">Abrir servicio →</span>
            </Link>;
          })}
        </div>
      </section>
    </>
  );
}

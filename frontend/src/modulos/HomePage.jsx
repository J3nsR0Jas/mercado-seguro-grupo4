import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const modules = [
  { id: 'mercado', name: 'Mercado Mayorista', intro: 'Ubicación, trámites de puestos y servicios al comerciante.', path: '/mercado', color: 'market' },
  { id: 'pnp', name: 'Central de Emergencias PNP', intro: 'Servicios institucionales, denuncias y seguimiento.', path: '/pnp', color: 'police' },
  { id: 'essalud', name: 'EsSalud Norte Chico', intro: 'Atención, citas y servicios para asegurados.', path: '/essalud', color: 'health' }
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const accessible = user
    ? modules.map((module) => {
      const roles = user.roles.filter((role) => role.modulo === module.id);
      return { ...module, roles };
    }).filter((module) => module.roles.length > 0)
    : modules;

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">PLATAFORMA INTEGRADA · GRUPO 4</p>
          <h1>{user ? `Hola, ${user.nombre}` : 'Tres servicios. Un solo lugar.'}</h1>
          <p>Un mismo acceso conecta al comerciante, la PNP y EsSalud.</p>
          {!user && !loading && <Link className="button button-primary" to="/login">Iniciar sesión</Link>}
        </div>
        <div className="hero-mark" aria-hidden="true">MS</div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div><p className="eyebrow">{user ? 'TU MENÚ POR ROLES' : 'PORTALES DISPONIBLES'}</p><h2>{user ? 'Servicios disponibles' : 'Elige un módulo'}</h2></div>
        </div>
        <div className="module-grid">
          {accessible.map((module) => (
            <article key={module.id} className={`module-card ${module.color}`}>
              <span className="module-icon">{module.id === 'mercado' ? '01' : module.id === 'pnp' ? '02' : '03'}</span>
              <h3>{module.name}</h3>
              <p>{module.intro}</p>
              {module.roles && <span className="role-tag">{module.roles.map((role) => role.rol).join(' · ')}</span>}
              <div className="home-card-actions">
                <Link className="card-link" to={module.path}>Abrir portal →</Link>
                {!user && <Link className="button button-secondary" to={`/login?modulo=${module.id}`}>Iniciar sesión</Link>}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="home-citizen-spotlight" aria-labelledby="home-pnp-heading">
        <img className="home-pnp-image" src="/images/pnp-hero.jpeg" alt="Servicio policial para la seguridad ciudadana" loading="lazy" />
        <div>
          <p className="eyebrow">ORIENTACIÓN CIUDADANA · PNP</p>
          <h2 id="home-pnp-heading">Infórmate y ayuda a prevenir incidentes</h2>
          <p>Encuentra recomendaciones para zonas comerciales, canales de atención y orientación para reportar una emergencia.</p>
          <div className="home-spotlight-actions">
            <Link className="button pnp-action-primary" to="/pnp">Conocer el portal PNP</Link>
            <a className="home-emergency-link" href="tel:105">Emergencias: 105</a>
          </div>
        </div>
      </section>
    </>
  );
}

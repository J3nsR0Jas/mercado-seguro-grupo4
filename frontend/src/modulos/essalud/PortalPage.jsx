import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const news = [
  {
    date: '25 NOV 2026',
    category: 'PREVENCIÓN',
    title: 'Pequeñas acciones diarias para cuidar tu salud y bienestar',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=85',
    alt: 'Profesional de salud brinda atención a una paciente'
  },
  {
    date: '19 NOV 2026',
    category: 'CAMPAÑA DE SALUD',
    title: 'Chequeos preventivos: cuándo programar una evaluación médica',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=85',
    alt: 'Equipo médico en un centro de atención'
  },
  {
    date: '12 NOV 2026',
    category: 'ORIENTACIÓN',
    title: 'Prepara tus datos para solicitar una cita médica en línea',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=85',
    alt: 'Atención médica en consulta'
  }
];

export default function EssaludPortalPage() {
  const { user } = useAuth();
  const hasAccess = Boolean(user?.roles.some((item) => item.modulo === 'essalud'));
  const employee = Boolean(user?.roles.some((item) => item.modulo === 'essalud' && item.rol === 'empleado'));
  const appointmentPath = employee ? '/essalud/panel' : '/essalud/cita';

  return (
    <div className="institutional-portal essalud-institutional">
      <section className="institutional-hero">
        <div className="institutional-hero-copy">
          <p className="institutional-kicker"><span className="institutional-health-mark" aria-hidden="true">+</span> ESSALUD · RED NORTE CHICO</p>
          <h1>Cuidamos tu salud y la de tu familia</h1>
          <p>Encuentra orientación, servicios y canales de atención para acompañarte en cada etapa de tu bienestar.</p>
          <div className="institutional-actions">
            <Link className="button health-action-primary" to={appointmentPath}>{employee ? 'Gestionar citas' : 'Solicitar una cita'}</Link>
            {hasAccess && !employee
              ? <Link className="button health-action-secondary" to="/essalud/mis-citas">Consultar mis citas</Link>
              : !hasAccess && <Link className="button health-action-secondary" to="/login?modulo=essalud">Iniciar sesión</Link>}
          </div>
        </div>
        <div className="institutional-hero-seal health-seal" aria-hidden="true">+</div>
      </section>

      <div className="institutional-content-grid">
        <section className="institutional-news" aria-labelledby="essalud-news-heading">
          <div className="institutional-section-heading">
            <div><p className="eyebrow">SALUD Y PREVENCIÓN</p><h2 id="essalud-news-heading">Últimas Noticias y Campañas</h2></div>
            <span className="institutional-updated">Actualizado hoy</span>
          </div>
          <div className="institutional-news-grid">
            {news.map((item) => (
              <article className="institutional-news-card" key={item.title}>
                <img src={item.image} alt={item.alt} loading="lazy" />
                <div className="institutional-news-copy">
                  <div className="news-meta"><span>{item.category}</span><time>{item.date}</time></div>
                  <h3>{item.title}</h3>
                  <a href="https://www.gob.pe/institucion/essalud/noticias" target="_blank" rel="noreferrer">Leer más <span aria-hidden="true">→</span></a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="institutional-aside">
          <p className="eyebrow">ATENCIÓN AL ASEGURADO</p>
          <h2>Canales Oficiales y Atención Rápida</h2>
          <div className="official-contact">
            <span className="contact-icon" aria-hidden="true">C</span>
            <div><strong>Solicita una cita</strong><Link to={appointmentPath}>{employee ? 'Gestionar citas' : 'Iniciar solicitud en línea'}</Link></div>
          </div>
          <div className="official-contact">
            <span className="contact-icon" aria-hidden="true">+</span>
            <div><strong>Central EsSalud</strong><a href="tel:4118000">Llama al (01) 411-8000</a></div>
          </div>
          <div className="institutional-hours">
            <strong>Orientación y citas</strong>
            <p>Trámites en línea disponibles en cualquier momento.</p>
            <small>La atención presencial depende del horario de cada establecimiento.</small>
          </div>
          <div className="institutional-notice">
            <strong>¿Necesitas atención urgente?</strong>
            <p>Acude al servicio de emergencia más cercano.</p>
          </div>
          <a className="official-site-link" href="https://www.gob.pe/essalud" target="_blank" rel="noreferrer">Portal oficial de EsSalud ↗</a>
        </aside>
      </div>
    </div>
  );
}

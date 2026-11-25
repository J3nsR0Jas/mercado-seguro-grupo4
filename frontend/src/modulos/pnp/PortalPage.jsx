import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const news = [
  {
    date: '25 NOV 2026',
    category: 'PREVENCIÓN',
    title: 'Recomendaciones para realizar compras seguras en mercados',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85',
    alt: 'Personas recorren un mercado de productos frescos'
  },
  {
    date: '18 NOV 2026',
    category: 'CAMPAÑA CIUDADANA',
    title: 'La denuncia digital: canales seguros para reportar incidentes',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=85',
    alt: 'Equipo colaborando en una iniciativa comunitaria'
  },
  {
    date: '10 NOV 2026',
    category: 'SERVICIO',
    title: 'Conoce qué información preparar antes de registrar una denuncia',
    image: 'https://images.unsplash.com/photo-1453873531674-2151bcd01707?auto=format&fit=crop&w=900&q=85',
    alt: 'Agente de seguridad en servicio'
  }
];

export default function PnpPortalPage() {
  const { user } = useAuth();
  const hasAccess = Boolean(user?.roles.some((item) => item.modulo === 'pnp'));
  const employee = Boolean(user?.roles.some((item) => item.modulo === 'pnp' && item.rol === 'empleado'));
  const reportPath = employee ? '/pnp/panel' : '/pnp/denuncia';

  return (
    <div className="institutional-portal pnp-institutional">
      <section className="institutional-hero">
        <div className="institutional-hero-copy">
          <p className="institutional-kicker"><img src="/images/pnp-logo.png" alt="" /> POLICÍA NACIONAL DEL PERÚ</p>
          <h1>Al servicio de la seguridad ciudadana</h1>
          <p>Orientación, prevención y atención digital para construir comunidades más seguras.</p>
          <div className="institutional-actions">
            <Link className="button pnp-action-primary" to={reportPath}>{employee ? 'Abrir panel PNP' : 'Registrar una denuncia'}</Link>
            {hasAccess && !employee
              ? <Link className="button pnp-action-secondary" to="/pnp/mis-denuncias">Consultar mis denuncias</Link>
              : !hasAccess && <Link className="button pnp-action-secondary" to="/login?modulo=pnp">Iniciar sesión</Link>}
          </div>
        </div>
        <div className="institutional-hero-seal" aria-hidden="true">PNP</div>
      </section>

      <div className="institutional-content-grid">
        <section className="institutional-news" aria-labelledby="pnp-news-heading">
          <div className="institutional-section-heading">
            <div><p className="eyebrow">INFORMACIÓN CIUDADANA</p><h2 id="pnp-news-heading">Últimas Noticias y Campañas</h2></div>
            <span className="institutional-updated">Actualizado hoy</span>
          </div>
          <div className="institutional-news-grid">
            {news.map((item) => (
              <article className="institutional-news-card" key={item.title}>
                <img src={item.image} alt={item.alt} loading="lazy" />
                <div className="institutional-news-copy">
                  <div className="news-meta"><span>{item.category}</span><time>{item.date}</time></div>
                  <h3>{item.title}</h3>
                  <a href="https://www.gob.pe/institucion/pnp/noticias" target="_blank" rel="noreferrer">Leer más <span aria-hidden="true">→</span></a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="institutional-aside">
          <p className="eyebrow">CANALES DE SERVICIO</p>
          <h2>Canales Oficiales y Atención Rápida</h2>
          <div className="official-contact emergency-contact">
            <span className="contact-icon" aria-hidden="true">105</span>
            <div><strong>Central de emergencias</strong><a href="tel:105">Llama al 105</a></div>
          </div>
          <div className="official-contact">
            <span className="contact-icon" aria-hidden="true">24</span>
            <div><strong>Denuncia digital</strong><Link to={reportPath}>{employee ? 'Abrir panel de atención' : 'Iniciar trámite en línea'}</Link></div>
          </div>
          <div className="institutional-hours">
            <strong>Atención digital</strong>
            <p>Registro de denuncias disponible en línea las 24 horas.</p>
            <small>En una emergencia, comunícate directamente con el 105.</small>
          </div>
          <div className="institutional-notice">
            <strong>Aviso importante</strong>
            <p>La denuncia digital no reemplaza la atención inmediata de emergencias.</p>
          </div>
          <a className="official-site-link" href="https://www.gob.pe/pnp" target="_blank" rel="noreferrer">Portal oficial de la PNP ↗</a>
        </aside>
      </div>
    </div>
  );
}

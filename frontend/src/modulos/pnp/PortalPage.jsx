import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const news = [
  {
    date: '25 NOV 2026',
    category: 'PREVENCIÓN',
    title: 'Operativos preventivos y orientación en centros de abastos',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85',
    alt: 'Personas recorren un mercado de productos frescos',
    detail: 'La coordinación entre comerciantes y autoridades ayuda a mantener libres los pasillos, identificar riesgos y comunicar incidentes oportunamente. Consulta siempre los canales oficiales de tu localidad.'
  },
  {
    date: '18 NOV 2026',
    category: 'CAMPAÑA CIUDADANA',
    title: 'Seguridad ciudadana en zonas comerciales concurridas',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=85',
    alt: 'Equipo colaborando en una iniciativa comunitaria',
    detail: 'Evita dejar mercadería sin vigilancia, acuerda protocolos con tu equipo y reporta situaciones sospechosas sin exponerte. Ante una emergencia, llama al 105.'
  },
  {
    date: '10 NOV 2026',
    category: 'SERVICIO',
    title: 'Conoce qué información preparar antes de registrar una denuncia',
    image: 'https://images.unsplash.com/photo-1453873531674-2151bcd01707?auto=format&fit=crop&w=900&q=85',
    alt: 'Agente de seguridad en servicio',
    detail: 'Anota fecha, hora, lugar y una descripción objetiva de lo ocurrido. Conserva evidencias sin alterar y evita publicar datos personales de terceros en redes sociales.'
  }
];

const rewards = [
  { alias: 'Caso demostrativo A', offense: 'Ejemplo de delito patrimonial', amount: 'Monto por verificar en fuente oficial' },
  { alias: 'Caso demostrativo B', offense: 'Ejemplo de requisitoria pendiente', amount: 'Monto por verificar en fuente oficial' }
];

const missingPeople = [
  { name: 'Ficha referencial 01', age: '17 años', lastSeen: 'Fecha y lugar: consultar alerta oficial vigente', features: 'Descripción física disponible únicamente en la ficha oficial.' },
  { name: 'Ficha referencial 02', age: 'Adulto', lastSeen: 'Fecha y lugar: consultar alerta oficial vigente', features: 'No se publican datos personales ficticios como si fueran una alerta real.' }
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
          <div className="institutional-news-grid pnp-news-grid">
            {news.map((item) => (
              <article className="institutional-news-card" key={item.title}>
                <img src={item.image} alt={item.alt} loading="lazy" />
                <div className="institutional-news-copy">
                  <div className="news-meta"><span>{item.category}</span><time>{item.date}</time></div>
                  <h3>{item.title}</h3>
                  <details>
                    <summary>Ver detalle</summary>
                    <p>{item.detail}</p>
                  </details>
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

      <section className="pnp-information-section" aria-labelledby="pnp-rewards-heading">
        <p className="eyebrow">INFORMACIÓN CIUDADANA · MATERIAL DEMOSTRATIVO</p>
        <h2 id="pnp-rewards-heading">Programa de Recompensas</h2>
        <p>Las fichas siguientes son ejemplos de presentación, no identifican personas buscadas ni constituyen información oficial. Verifica requisitorias y montos únicamente en los canales oficiales de la PNP.</p>
        <div className="pnp-info-grid">
          {rewards.map((item) => <article className="pnp-info-card" key={item.alias}>
            <span className="pnp-info-icon" aria-hidden="true">★</span>
            <h3>{item.alias}</h3>
            <p><strong>Referencia:</strong> {item.offense}</p>
            <p><strong>Recompensa:</strong> {item.amount}</p>
            <p><strong>Línea gratuita confidencial:</strong> confirma el canal vigente en la información oficial de la PNP. En una emergencia, llama al 105.</p>
            <Link className="button pnp-action-primary" to={reportPath}>Reportar a la PNP</Link>
          </article>)}
        </div>
      </section>

      <section className="pnp-information-section" aria-labelledby="pnp-missing-heading">
        <p className="eyebrow">BÚSQUEDA Y ALERTAS OFICIALES</p>
        <h2 id="pnp-missing-heading">Personas desaparecidas</h2>
        <p>Estas fichas son espacios ilustrativos, no alertas vigentes. Revisa los avisos oficiales antes de compartir información; no difundas datos no confirmados.</p>
        <div className="pnp-info-grid">
          {missingPeople.map((person, index) => <article className="missing-person-card" key={person.name}>
            <img src={index === 0
              ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=85'
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=85'} alt="Retrato referencial, no corresponde a una persona desaparecida" loading="lazy" />
            <div>
              <span className="alert-label">FICHA REFERENCIAL</span>
              <h3>{person.name}</h3>
              <p><strong>Edad:</strong> {person.age}</p>
              <p><strong>Última vez vista:</strong> {person.lastSeen}</p>
              <p><strong>Rasgos:</strong> {person.features}</p>
              <a className="button pnp-action-primary" href="tel:105">Contacto inmediato: 105</a>
            </div>
          </article>)}
        </div>
      </section>

      <section className="pnp-information-section pnp-guidance" aria-labelledby="pnp-rules-heading">
        <p className="eyebrow">CONVIVENCIA Y PREVENCIÓN</p>
        <h2 id="pnp-rules-heading">Normas, reglas y prevenciones</h2>
        <div className="pnp-guidance-grid">
          <article><h3>Convivencia ciudadana</h3><ul><li>Respeta las indicaciones del personal y mantén libres las rutas de evacuación.</li><li>Cuida los espacios comunes y comunica conflictos sin recurrir a la violencia.</li><li>Protege la privacidad: evita publicar imágenes o datos de otras personas sin autorización.</li></ul></article>
          <article><h3>Seguridad comercial</h3><ul><li>Verifica pagos desde tu propia aplicación; no compartas claves ni códigos de confirmación.</li><li>Coordina la carga y descarga con personal autorizado y evita dejar objetos de valor a la vista.</li><li>Ante robos o extorsiones, no te enfrentes al agresor; busca un lugar seguro y reporta a la PNP.</li></ul></article>
          <article><h3>Ante estafas o emergencias</h3><ul><li>Desconfía de solicitudes urgentes de dinero y confirma la identidad por un canal conocido.</li><li>Guarda mensajes, comprobantes y datos del incidente sin editar las evidencias.</li><li>Para una emergencia, llama al 105; para orientación no urgente, acude a una comisaría.</li></ul></article>
        </div>
      </section>
    </div>
  );
}

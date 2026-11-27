import { useState } from 'react';
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
  const [donorFormOpen, setDonorFormOpen] = useState(false);
  const [donorRegistered, setDonorRegistered] = useState(false);
  const hasAccess = Boolean(user?.roles.some((item) => item.modulo === 'essalud'));
  const employee = Boolean(user?.roles.some((item) => item.modulo === 'essalud' && item.rol === 'empleado'));
  const appointmentPath = employee ? '/essalud/panel' : '/essalud/cita';

  function registerDonor(event) {
    event.preventDefault();
    setDonorRegistered(true);
    setDonorFormOpen(false);
  }

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

      <section className="health-flow-section" aria-labelledby="health-prevention-heading">
        <div className="health-flow-copy">
          <p className="eyebrow">PREVENCIÓN Y VACUNATÓN</p>
          <h2 id="health-prevention-heading">Prevenir también es cuidar</h2>
          <p>Las vacunas ayudan a prevenir enfermedades y protegen a la comunidad. Revisa tu carné, consulta al personal de salud qué dosis corresponden a tu edad y condición, y confirma en tu establecimiento el cronograma vigente antes de acudir.</p>
          <div className="health-banner">
            <strong>Antes de asistir a una jornada</strong>
            <ul><li>Lleva DNI y carné de vacunación si lo tienes.</li><li>Consulta disponibilidad, sede, horario y requisitos con el establecimiento de salud.</li><li>Informa al personal sobre alergias, embarazo, enfermedades o tratamientos actuales.</li></ul>
          </div>
          <div className="health-calendar">
            <h3>Calendario orientativo de vacunación</h3>
            <div><strong>Primera infancia</strong><span>Revisa en el carné las dosis correspondientes a cada edad con el personal de salud.</span></div>
            <div><strong>Adolescencia y adultez</strong><span>Consulta el esquema vigente y las vacunas recomendadas según antecedentes y riesgos.</span></div>
            <div><strong>Campañas del año</strong><span>Confirma fechas, grupos priorizados y sedes anunciadas por tu establecimiento.</span></div>
          </div>
        </div>
        <img className="health-flow-image" src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1100&q=85" alt="Profesional de salud acompaña a una paciente" loading="lazy" />
      </section>

      <section className="health-flow-section health-flow-reverse" aria-labelledby="health-sexual-heading">
        <div className="health-flow-copy">
          <p className="eyebrow">ETS Y PREVENCIÓN SEXUAL</p>
          <h2 id="health-sexual-heading">Información clara, atención confidencial</h2>
          <p>La prevención combina información, barreras de protección y acceso oportuno a pruebas. Muchas infecciones de transmisión sexual pueden no presentar síntomas; un profesional puede orientarte sobre el despistaje adecuado.</p>
          <ul className="health-check-list">
            <li>Usa preservativos correctamente y desde el inicio de cada relación sexual.</li>
            <li>Consulta sobre métodos anticonceptivos y prevención combinada; ningún método requiere que renuncies a recibir orientación.</li>
            <li>Pregunta en tu establecimiento por pruebas de despistaje, consejería y disponibilidad gratuita.</li>
            <li>La atención es confidencial. Evita automedicarte y acude a evaluación ante síntomas o posible exposición.</li>
          </ul>
          <Link className="button health-inline-button" to={appointmentPath}>Solicitar orientación</Link>
        </div>
        <img className="health-flow-image" src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1100&q=85" alt="Profesional de salud brinda orientación durante una consulta" loading="lazy" />
      </section>

      <section className="health-flow-section" aria-labelledby="health-prenatal-heading">
        <div className="health-flow-copy">
          <p className="eyebrow">ACCIONES PRENATALES</p>
          <h2 id="health-prenatal-heading">Acompañamiento durante el embarazo</h2>
          <p>Iniciar los controles prenatales temprano permite resolver dudas y planificar una atención integral. La frecuencia y las evaluaciones se definen con el equipo de salud de acuerdo con cada embarazo.</p>
          <div className="prenatal-timeline">
            <article><span>01</span><div><h3>Primer trimestre</h3><p>Agenda la evaluación inicial, comparte antecedentes y consulta sobre análisis y suplementación indicados para ti.</p></div></article>
            <article><span>02</span><div><h3>Segundo trimestre</h3><p>Mantén los controles programados, pregunta por alimentación variada, actividad segura y señales que debas vigilar.</p></div></article>
            <article><span>03</span><div><h3>Tercer trimestre</h3><p>Revisa el plan de parto, el establecimiento de referencia y cómo pedir ayuda si aparecen signos de alarma.</p></div></article>
          </div>
          <div className="health-warning"><strong>Busca atención de inmediato</strong><p>Ante sangrado, dolor intenso, fiebre, dificultad para respirar, dolor de cabeza severo, visión borrosa o disminución marcada de movimientos fetales, contacta a un servicio de salud o acude a emergencia.</p></div>
        </div>
        <img className="health-flow-image" src="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=1100&q=85" alt="Atención prenatal con acompañamiento profesional" loading="lazy" />
      </section>

      <section className="blood-donation-card" aria-labelledby="blood-donation-heading">
        <div className="blood-donation-copy">
          <p className="eyebrow">DONACIÓN VOLUNTARIA</p>
          <h2 id="blood-donation-heading">Tu donación puede ayudar a salvar vidas</h2>
          <p>Los requisitos y horarios pueden variar por sede. Confirma la información con el banco de sangre antes de trasladarte.</p>
          <div className="blood-donation-columns">
            <div><h3>Requisitos generales</h3><ul><li>Presentar documento de identidad y responder la evaluación de salud.</li><li>Acudir habiendo descansado y alimentado según las indicaciones del centro.</li><li>La aptitud final la determina el personal de salud.</li></ul></div>
            <div><h3>Tipos y horarios</h3><p>Se necesitan donantes de todos los grupos sanguíneos; las necesidades cambian por establecimiento y fecha.</p><p><strong>Horario:</strong> consulta disponibilidad y horario de atención del banco de sangre elegido.</p></div>
          </div>
          {donorRegistered
            ? <p className="donor-confirmation" role="status">Registro de interés guardado solo en esta sesión. Contacta al banco de sangre para coordinar una donación.</p>
            : <button className="button health-action-primary" type="button" onClick={() => setDonorFormOpen((open) => !open)} aria-expanded={donorFormOpen}>
              {donorFormOpen ? 'Cerrar registro' : 'Registrarme como donante voluntario'}
            </button>}
          {donorFormOpen && <form className="donor-form" onSubmit={registerDonor}>
            <label>Nombre<input name="nombre" required autoComplete="name" /></label>
            <label>Teléfono de contacto<input name="telefono" type="tel" required autoComplete="tel" /></label>
            <label>Grupo sanguíneo (opcional)<select name="grupo"><option value="">No lo conozco</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select></label>
            <button className="button health-action-primary" type="submit">Guardar interés en esta sesión</button>
            <p className="hint">Este formulario demostrativo no envía ni almacena tus datos.</p>
          </form>}
        </div>
        <img src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=85" alt="Donación voluntaria de sangre en un centro de salud" loading="lazy" />
      </section>

      <section className="health-news-section" aria-labelledby="essalud-news-heading">
        <div className="institutional-section-heading">
          <div><p className="eyebrow">SALUD Y PREVENCIÓN</p><h2 id="essalud-news-heading">Noticias y campañas</h2></div>
          <a className="official-site-link" href="https://www.gob.pe/institucion/essalud/noticias" target="_blank" rel="noreferrer">Ver noticias oficiales ↗</a>
        </div>
        <div className="institutional-news-grid">
          {news.map((item) => <article className="institutional-news-card" key={item.title}>
            <img src={item.image} alt={item.alt} loading="lazy" />
            <div className="institutional-news-copy">
              <div className="news-meta"><span>{item.category}</span><time>{item.date}</time></div>
              <h3>{item.title}</h3>
              <a href="https://www.gob.pe/institucion/essalud/noticias" target="_blank" rel="noreferrer">Consultar fuente oficial <span aria-hidden="true">↗</span></a>
            </div>
          </article>)}
        </div>
      </section>

      <aside className="health-service-strip">
        <div><p className="eyebrow">ATENCIÓN AL ASEGURADO</p><h2>¿Necesitas una cita o información?</h2><p>Los horarios y servicios disponibles dependen del establecimiento de salud correspondiente.</p></div>
        <div className="health-service-actions">
          <Link className="button health-inline-button" to={appointmentPath}>{employee ? 'Gestionar citas' : 'Solicitar una cita'}</Link>
          {hasAccess && !employee && <Link className="button health-secondary-button" to="/essalud/mis-citas">Consultar mis citas</Link>}
          <a className="official-site-link" href="tel:4118000">Central EsSalud: (01) 411-8000</a>
          <a className="official-site-link" href="https://www.gob.pe/essalud" target="_blank" rel="noreferrer">Portal oficial EsSalud ↗</a>
        </div>
      </aside>
    </div>
  );
}

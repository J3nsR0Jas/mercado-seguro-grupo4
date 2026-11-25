import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client.js';
import { Feedback, Status } from '../../components/Feedback.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const services = [
  { title: 'Medicina general', text: 'Atención primaria y orientación para el cuidado de la salud.' },
  { title: 'Prevención y vacunación', text: 'Consulta en tu sede la disponibilidad de campañas preventivas.' },
  { title: 'Atención de urgencias', text: 'Acude a una sede asistencial o llama a emergencias si se requiere atención inmediata.' }
];

export default function EssaludPortalPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const employee = user.roles.some((item) => item.modulo === 'essalud' && item.rol === 'empleado');
  const canAccessPnp = user.roles.some((item) => item.modulo === 'pnp');

  useEffect(() => {
    api('/essalud/citas')
      .then(({ citas }) => setAppointments(citas))
      .catch((requestError) => setError(requestError.message));
  }, []);

  const active = appointments.filter((item) => !['atendida', 'cancelada'].includes(item.estado));

  return <>
    <section className="portal-hero health-portal">
      <div className="portal-hero-content">
        <p className="portal-kicker"><span className="health-emblem" aria-hidden="true">+</span> HOSPITAL ESSALUD NORTE CHICO</p>
        <h1>Seguridad y salud integral a tu servicio</h1>
        <p>Atención médica, prestaciones de salud y servicios para cuidar el bienestar de las familias de Norte Chico.</p>
        <div className="actions">
          {employee
            ? <Link className="button button-primary" to="/essalud/panel">Abrir panel de citas</Link>
            : <><Link className="button button-primary" to="/essalud/cita">Solicitar una cita</Link><Link className="button button-secondary" to="/essalud/mis-citas">Ver mis citas</Link></>}
        </div>
      </div>
    </section>

    <Feedback error={error} />

    <section className="portal-grid section">
      <article className="portal-card">
        <p className="eyebrow">GESTIÓN DE CITAS</p>
        <h2>Tu atención</h2>
        <p className="portal-metric"><strong>{appointments.length}</strong><span>citas visibles en tu perfil</span></p>
        <p><strong>{active.length}</strong> citas pendientes o en curso.</p>
        {appointments.slice(0, 3).map((appointment) => <p className="portal-row" key={appointment.id}>
          <span>{appointment.codigo_seguimiento} · {appointment.especialidad}</span><Status>{appointment.estado}</Status>
        </p>)}
      </article>
      <article className="portal-card">
        <p className="eyebrow">SEDES CONFIGURADAS</p>
        <h2>Elige dónde atenderte</h2>
        <p>Estas sedes están disponibles en el formulario de solicitud:</p>
        <ul className="portal-list health-sites"><li><span className="health-site-icon" aria-hidden="true">+</span><span><strong>Hospital EsSalud Norte Chico</strong><small>Atención médica y urgencias</small></span></li><li><span className="health-site-icon" aria-hidden="true">+</span><span><strong>Policlínico Huacho</strong><small>Consultas ambulatorias</small></span></li></ul>
        <Link className="text-link" to={employee ? '/essalud/panel' : '/essalud/cita'}>{employee ? 'Gestionar citas' : 'Solicitar atención'} →</Link>
      </article>
    </section>

    <section className="section">
      <div className="section-heading"><div><p className="eyebrow">ORIENTACIÓN</p><h2>Servicios de salud</h2></div></div>
      <div className="portal-services">
        {services.map((service) => <article className="portal-service" key={service.title}>
          <span>ESSALUD · NORTE CHICO</span><strong>{service.title}</strong><small>{service.text}</small>
        </article>)}
        {canAccessPnp && <Link className="portal-service" to="/pnp"><span>PNP · DERIVACIONES</span><strong>Atención derivada</strong><small>Consulta el portal policial para dar seguimiento al incidente relacionado.</small></Link>}
      </div>
    </section>
  </>;
}

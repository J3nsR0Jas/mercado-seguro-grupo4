import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client.js';
import { Feedback, Status } from '../../components/Feedback.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function PnpPortalPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const employee = user.roles.some((item) => item.modulo === 'pnp' && item.rol === 'empleado');
  const canAccessEssalud = user.roles.some((item) => item.modulo === 'essalud');

  useEffect(() => {
    api('/pnp/denuncias')
      .then(({ denuncias }) => setComplaints(denuncias))
      .catch((requestError) => setError(requestError.message));
  }, []);

  const active = complaints.filter((item) => item.estado !== 'atendido');

  return <>
    <section className="portal-hero police-portal">
      <div className="portal-hero-content">
        <p className="portal-kicker"><img className="pnp-crest" src="/images/pnp-logo.png" alt="" /> POLICÍA NACIONAL DEL PERÚ · SERVICIO OFICIAL</p>
        <h1>Denuncia Digital de la Policía Nacional del Perú</h1>
        <p>Registra tu denuncia de forma rápida, confidencial y segura las 24 horas. Realiza el seguimiento en línea de tus trámites.</p>
        <div className="actions">
          {employee
            ? <Link className="button button-primary" to="/pnp/panel">Abrir panel PNP</Link>
            : <><Link className="button button-primary" to="/pnp/denuncia">Registrar denuncia</Link><Link className="button button-secondary" to="/pnp/mis-denuncias">Consultar mis denuncias</Link></>}
        </div>
      </div>
      <img className="portal-hero-image pnp-hero-image" src="/images/pnp-hero.jpeg" alt="Ilustración de la Policía Nacional del Perú" />
    </section>

    <Feedback error={error} />

    <section className="portal-grid section">
      <article className="portal-card">
        <p className="eyebrow">SEGUIMIENTO EN LÍNEA</p>
        <h2>Actividad de tu perfil</h2>
        <p className="portal-metric"><strong>{complaints.length}</strong><span>denuncias visibles</span></p>
        <p><strong>{active.length}</strong> casos requieren seguimiento.</p>
        {complaints.slice(0, 3).map((complaint) => <p className="portal-row" key={complaint.id}>
          <span>{complaint.codigo_seguimiento} · {complaint.tipo_delito}</span><Status>{complaint.estado}</Status>
        </p>)}
      </article>
      <article className="portal-card emergency-card">
        <p className="eyebrow">EMERGENCIA INMEDIATA</p>
        <h2>Necesitas ayuda urgente</h2>
        <p>Para emergencias policiales inmediatas, comunícate con la central telefónica de la PNP.</p>
        <a className="emergency-number" href="tel:105">105</a>
        <p className="hint">La denuncia digital no reemplaza la atención de emergencia.</p>
      </article>
    </section>

    <section className="section">
      <div className="section-heading"><div><p className="eyebrow">ATENCIÓN COORDINADA</p><h2>Servicios disponibles</h2></div></div>
      <div className="portal-services">
        <Link className="portal-service" to={employee ? '/pnp/panel' : '/pnp/denuncia'}>
          <img className="portal-service-image pnp-service-image" src="/images/pnp-denuncia.jpeg" alt="" loading="lazy" />
          <span>01 · DENUNCIAS</span><strong>{employee ? 'Revisar reportes' : 'Registrar un incidente'}</strong><small>El sistema genera un código para consultar el estado desde el portal.</small>
        </Link>
        <Link className="portal-service" to="/pnp/mis-denuncias">
          <img className="portal-service-image pnp-service-image" src="/images/pnp-seguimiento.png" alt="" loading="lazy" />
          <span>02 · SEGUIMIENTO</span><strong>Consultar mis denuncias</strong><small>Revisa el avance y las actualizaciones de tus reportes.</small>
        </Link>
        {canAccessEssalud && <Link className="portal-service" to="/essalud">
          <img className="portal-service-image pnp-service-image" src="/images/pnp-validacion.png" alt="" loading="lazy" />
          <span>03 · DERIVACIÓN</span><strong>Atención de salud</strong><small>Los reportes con lesionados pueden derivarse al módulo EsSalud.</small>
        </Link>}
      </div>
    </section>
  </>;
}

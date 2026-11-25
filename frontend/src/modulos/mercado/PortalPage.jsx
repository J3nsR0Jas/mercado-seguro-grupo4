import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client.js';
import { Feedback, Status } from '../../components/Feedback.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const mapUrl = 'https://maps.google.com/maps?q=Mercado%20Mayorista%20de%20Lima%2C%20Santa%20Anita%2C%20Lima%2C%20Per%C3%BA&output=embed';
const directionsUrl = 'https://www.google.com/maps/search/?api=1&query=Mercado+Mayorista+de+Lima%2C+Santa+Anita%2C+Lima%2C+Peru';

export default function MercadoPortalPage() {
  const { user } = useAuth();
  const [stalls, setStalls] = useState([]);
  const [error, setError] = useState('');
  const role = user.roles.find((item) => item.modulo === 'mercado')?.rol;
  const canAccessPnp = user.roles.some((item) => item.modulo === 'pnp');
  const canAccessEssalud = user.roles.some((item) => item.modulo === 'essalud');

  useEffect(() => {
    api('/mercado/comerciantes')
      .then(({ puestos }) => setStalls(puestos))
      .catch((requestError) => setError(requestError.message));
  }, []);

  const actionPath = role === 'administrador' ? '/mercado/seguridad'
    : role === 'empleado' ? '/mercado/registros'
      : '/mercado/mi-puesto';

  return <>
    <section className="portal-hero market-portal">
      <div className="portal-hero-content">
        <p className="portal-kicker"><span className="market-emblem" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path fill="currentColor" d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg></span> EMPRESA MUNICIPAL DE MERCADOS · SANTA ANITA</p>
        <h1>El centro de abastecimiento más grande del país</h1>
        <p>Conectando productores, comerciantes y familias peruanas con productos frescos de la mejor calidad al por mayor.</p>
        <div className="actions">
          <Link className="button button-primary" to={role === 'cliente' ? '/mercado/registro' : actionPath}>
            {role === 'cliente' ? 'Registrar un puesto' : 'Abrir mi espacio de trabajo'}
          </Link>
          <Link className="button button-secondary" to={actionPath}>Ver mis servicios</Link>
        </div>
      </div>
      <img className="portal-hero-image" src="/images/mercado-hero.jpg" alt="Camiones y pabellones del Mercado Mayorista de Lima" />
    </section>

    <Feedback error={error} />

    <section className="portal-grid section">
      <article className="portal-card">
        <p className="eyebrow">GESTIÓN DIGITAL</p>
        <h2>Trámites del mercado</h2>
        <p>Registra y actualiza puestos, revisa su estado y consulta las incidencias enlazadas con PNP y EsSalud.</p>
        <p className="portal-metric"><strong>{stalls.length}</strong><span>solicitudes visibles en tu perfil</span></p>
        {stalls.slice(0, 3).map((stall) => <p className="portal-row" key={stall.id}>
          <span>{stall.puesto} · {stall.razon_social}</span><Status>{stall.estado}</Status>
        </p>)}
      </article>
      <article className="portal-card">
        <p className="eyebrow">UBICACIÓN</p>
        <h2>Encuentra el mercado</h2>
        <p>Mercado Mayorista de Lima, distrito de Santa Anita.</p>
        <img className="market-pavilion-image" src="/images/mercado-pabellon.jpg" alt="Comerciantes y pabellones de productos frescos" loading="lazy" />
        <div className="map-frame">
          <iframe title="Mapa del Mercado Mayorista de Lima en Santa Anita" src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
        <a className="text-link" href={directionsUrl} target="_blank" rel="noreferrer">Abrir indicaciones en Google Maps ↗</a>
      </article>
    </section>

    <section className="section">
      <div className="section-heading"><div><p className="eyebrow">ATENCIÓN INTEGRADA</p><h2>Servicios del comerciante</h2></div></div>
      <div className="portal-services">
        {canAccessPnp && <Link className="portal-service" to="/pnp"><span>02 · PNP</span><strong>Reportar un incidente</strong><small>Registrar y hacer seguimiento de denuncias asociadas al puesto.</small></Link>}
        {canAccessEssalud && <Link className="portal-service" to="/essalud"><span>03 · ESSALUD</span><strong>Atención de salud</strong><small>Solicitar citas y revisar derivaciones vinculadas a incidentes.</small></Link>}
      </div>
    </section>
  </>;
}

import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Feedback } from '../components/Feedback.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const moduleDetails = {
  mercado: {
    name: 'Mercado Mayorista',
    identity: 'MERCADO SEGURO · SANTA ANITA',
    suggestion: 'cliente1@correo.com'
  },
  pnp: {
    name: 'Policía Nacional del Perú',
    identity: 'POLICÍA NACIONAL DEL PERÚ',
    suggestion: 'empleado.pnp@pnp.gob.pe',
    emblem: 'pnp'
  },
  essalud: {
    name: 'EsSalud Norte Chico',
    identity: 'HOSPITAL ESSALUD NORTE CHICO',
    suggestion: 'empleado.essalud@essalud.pe',
    emblem: 'essalud'
  }
};

export default function LoginPage({ register = false }) {
  const { user, login, register: signUp } = useAuth();
  const [isRegister, setIsRegister] = useState(register);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('modulo');
  const module = moduleDetails[moduleId] ? moduleDetails[moduleId] : null;
  const destination = location.state?.from || (module ? `/${moduleId}` : '/');

  if (user) return <Navigate to={destination} replace />;

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      if (isRegister) await signUp(form.get('nombre'), form.get('correo'), form.get('contrasena'));
      else await login(form.get('correo'), form.get('contrasena'));
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  const identityClass = module?.emblem ? `auth-identity ${module.emblem}-identity` : 'auth-identity';

  return (
    <main className={`auth-page${module ? ` auth-${moduleId}` : ''}`}>
      <section className="auth-card">
        <p className={identityClass}>
          {module?.emblem === 'pnp' && <img className="auth-crest" src="/images/pnp-logo.png" alt="" />}
          {module?.emblem === 'essalud' && <span className="auth-health-emblem" aria-hidden="true">+</span>}
          {module ? module.identity : 'MERCADO SEGURO · GRUPO 4'}
        </p>
        <h1>{isRegister ? 'Crear cuenta' : module ? `Ingresar a ${module.name}` : 'Una cuenta. Tres servicios.'}</h1>
        <p className="muted">
          {module
            ? `Accede a los servicios de ${module.name}. Al ingresar volverás directamente a su portal.`
            : 'Mercado Mayorista, Central de Emergencias PNP y EsSalud Norte Chico.'}
        </p>
        <Feedback error={error} />
        <form className="form-grid" onSubmit={submit}>
          {isRegister && <label>Nombre completo<input name="nombre" required minLength="3" maxLength="120" autoComplete="name" /></label>}
          <label>Correo electrónico<input name="correo" type="email" required autoComplete="email" /></label>
          <label>Contraseña<input name="contrasena" type="password" required minLength={isRegister ? 10 : 1} autoComplete={isRegister ? 'new-password' : 'current-password'} /></label>
          <button className="button button-primary full" disabled={busy}>{busy ? 'Ingresando…' : isRegister ? 'Crear cuenta' : 'Ingresar'}</button>
        </form>
        <p className="muted">
          {isRegister ? '¿Ya tienes una cuenta?' : '¿Eres nuevo?'}{' '}
          <button className="text-button" onClick={() => { setError(''); setIsRegister(!isRegister); }}>
            {isRegister ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>
        {isRegister && <p className="hint">Las cuentas nuevas reciben únicamente permisos básicos de cliente. Los roles de administración y atención institucional son asignados por el sistema.</p>}
        {!isRegister && <p className="hint">Prueba: {module?.suggestion || 'cliente1@correo.com'} · contraseña Mercado2026!</p>}
        <Link className="auth-home-link" to="/">Volver al inicio</Link>
      </section>
    </main>
  );
}

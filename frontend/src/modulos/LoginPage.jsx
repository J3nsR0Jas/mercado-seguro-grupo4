import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Feedback } from '../components/Feedback.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage({ register = false }) {
  const { user, login, register: signUp } = useAuth();
  const [isRegister, setIsRegister] = useState(register);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (user) return <Navigate to="/" replace />;

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      if (isRegister) await signUp(form.get('nombre'), form.get('correo'), form.get('contrasena'));
      else await login(form.get('correo'), form.get('contrasena'));
      navigate(location.state?.from || '/', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">MERCADO SEGURO · GRUPO 4</p>
        <h1>{isRegister ? 'Crear cuenta' : 'Una cuenta. Tres servicios.'}</h1>
        <p className="muted">Mercado Mayorista, Central de Emergencias PNP y EsSalud Norte Chico.</p>
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
        {!isRegister && <p className="hint">Prueba: cliente1@correo.com · contraseña Mercado2026!</p>}
      </section>
    </main>
  );
}

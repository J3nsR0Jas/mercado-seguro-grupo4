import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, jsonBody } from '../../api/client.js';
import { Feedback } from '../../components/Feedback.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function CitaPage() {
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const { cita } = await api('/essalud/citas', { method: 'POST', body: jsonBody(values) });
      navigate('/essalud/mis-citas', { state: { info: `Cita ${cita.codigo_seguimiento} registrada. Monto calculado: S/ ${Number(cita.monto_calculado).toFixed(2)}.` } });
    } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
  }
  return <>
    <div className="page-title"><p className="eyebrow">ESSALUD NORTE CHICO</p><h1>Solicitar cita</h1><p>Los casos derivados por la PNP se crean automáticamente y aparecen vinculados a su denuncia.</p></div>
    <Feedback error={error} />
    <form className="panel form-grid two-columns" onSubmit={submit}>
      <label>Número de asegurado<input name="numero_asegurado" inputMode="numeric" pattern="[0-9]{4,20}" required /></label>
      <label>Nombre del paciente<input name="nombre_paciente" defaultValue={user.nombre} required maxLength="120" /></label>
      <label>Sede<select name="sede" required defaultValue="">
        <option value="" disabled>Selecciona una sede</option><option>Hospital EsSalud Norte Chico</option><option>Policlínico Huacho</option>
      </select></label>
      <label>Tipo de asegurado<select name="tipo_asegurado" required><option value="titular">Titular · S/ 10</option><option value="derechohabiente">Derechohabiente · S/ 18</option></select></label>
      <label>Especialidad<input name="especialidad" defaultValue="Medicina general" required /></label>
      <label>Motivo<textarea name="motivo" rows="2" defaultValue="Solicitud de atención médica" /></label>
      <button className="button button-primary" disabled={busy}>{busy ? 'Guardando…' : 'Solicitar cita'}</button>
    </form>
  </>;
}

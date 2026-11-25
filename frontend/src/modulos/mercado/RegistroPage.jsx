import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, jsonBody } from '../../api/client.js';
import { Feedback } from '../../components/Feedback.jsx';

const initial = { razon_social: '', producto: '', telefono: '', direccion: 'Mercado Mayorista de Lima', puesto: '', area_m2: 4, dias: 1, alto_consumo: false };

export default function RegistroPage() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    values.area_m2 = Number(values.area_m2);
    values.dias = Number(values.dias);
    values.alto_consumo = values.alto_consumo === 'on';
    try {
      const { puesto } = await api('/mercado/comerciantes', { method: 'POST', body: jsonBody(values) });
      navigate('/mercado/mi-puesto', { state: { info: `Solicitud ${puesto.codigo_seguimiento} registrada.` } });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }
  return <>
    <div className="page-title"><p className="eyebrow">MERCADO MAYORISTA</p><h1>Registrar puesto</h1><p>El importe se calcula en el servidor a S/ 15 por m² al día, más S/ 5 por alto consumo.</p></div>
    <form className="panel form-grid two-columns" onSubmit={submit}>
      <label>Razón social<input name="razon_social" required maxLength="150" /></label>
      <label>Producto principal / rubro<input name="producto" required maxLength="120" /></label>
      <label>Teléfono<input name="telefono" required maxLength="20" /></label>
      <label>Dirección<input name="direccion" required defaultValue={initial.direccion} maxLength="220" /></label>
      <label>Número de puesto<input name="puesto" required placeholder="B-14" maxLength="30" /></label>
      <label>Área (m²)<input name="area_m2" type="number" min="1" step="0.5" defaultValue={initial.area_m2} required /></label>
      <label>Días de alquiler<input name="dias" type="number" min="1" max="365" defaultValue={initial.dias} required /></label>
      <label className="check-label"><input name="alto_consumo" type="checkbox" /> Alto consumo (+ S/ 5 por m²/día)</label>
      <Feedback error={error} />
      <button className="button button-primary" disabled={busy}>{busy ? 'Guardando…' : 'Enviar solicitud'}</button>
    </form>
  </>;
}

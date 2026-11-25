import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, jsonBody } from '../../api/client.js';
import { Feedback } from '../../components/Feedback.jsx';

export default function DenunciaPage() {
  const [params] = useSearchParams();
  const [stalls, setStalls] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api('/mercado/mi-puesto')
      .then(({ puestos }) => setStalls(puestos))
      .catch((requestError) => setError(requestError.message));
  }, []);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const form = Object.fromEntries(new FormData(event.currentTarget));
    form.hay_lesionados = form.hay_lesionados === 'on';
    form.id_comerciante = Number(form.id_comerciante);
    try {
      const { denuncia } = await api('/pnp/denuncias', { method: 'POST', body: jsonBody(form) });
      navigate('/pnp/mis-denuncias', { state: { info: `Denuncia ${denuncia.codigo_seguimiento} registrada.` } });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return <>
    <div className="page-title"><p className="eyebrow">CENTRAL DE EMERGENCIAS PNP</p><h1>Denuncia digital</h1><p>Elige tu puesto para enlazar el incidente con el perfil del comerciante.</p></div>
    <Feedback error={error} />
    <form className="panel form-grid two-columns" onSubmit={submit}>
      <label>Puesto vinculado<select name="id_comerciante" required defaultValue={params.get('id_comerciante') || ''}>
        <option value="" disabled>Selecciona un puesto</option>
        {stalls.map((stall) => <option key={stall.id} value={stall.id}>{stall.puesto} · {stall.razon_social}</option>)}
      </select></label>
      <label>DNI del denunciante<input name="dni" inputMode="numeric" pattern="[0-9]{8,12}" required /></label>
      <label>Tipo de incidente<select name="tipo" required defaultValue="">
        <option value="" disabled>Selecciona</option><option>Robo de mercadería</option><option>Hurto</option><option>Daños materiales</option><option>Otro</option>
      </select></label>
      <label>Lugar del incidente<input name="lugar" required maxLength="220" /></label>
      <label className="wide">Detalle de los hechos<textarea name="detalle" rows="4" required maxLength="4000" /></label>
      <label className="check-label"><input name="hay_lesionados" type="checkbox" /> Hay personas lesionadas (permite derivar a EsSalud)</label>
      <button className="button button-primary" disabled={busy || stalls.length === 0}>{busy ? 'Guardando…' : 'Enviar denuncia'}</button>
    </form>
  </>;
}

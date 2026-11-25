import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api, jsonBody } from '../../api/client.js';
import { Feedback, Status } from '../../components/Feedback.jsx';
import DerivarEssalud from '../../integraciones/DerivarEssalud.jsx';

export default function DenunciasPage({ employee = false }) {
  const location = useLocation();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [info, setInfo] = useState(location.state?.info || '');
  const [editing, setEditing] = useState(null);
  const load = useCallback(() => api('/pnp/denuncias').then(({ denuncias }) => setRows(denuncias)), []);
  useEffect(() => { load().catch((requestError) => setError(requestError.message)); }, [load]);

  async function updateStatus(row, estado) {
    setError('');
    setInfo('');
    try {
      await api(`/pnp/denuncias/${row.id}/estado`, { method: 'PATCH', body: jsonBody({ estado }) });
      setInfo(`${row.codigo_seguimiento}: estado actualizado a ${estado}.`);
      await load();
    } catch (requestError) { setError(requestError.message); }
  }

  async function saveText(event) {
    event.preventDefault();
    setError('');
    try {
      const values = Object.fromEntries(new FormData(event.currentTarget));
      await api(`/pnp/denuncias/${editing.id}`, { method: 'PUT', body: jsonBody(values) });
      setEditing(null);
      setInfo('Denuncia actualizada.');
      await load();
    } catch (requestError) { setError(requestError.message); }
  }

  return <>
    <div className="page-title"><p className="eyebrow">CENTRAL DE EMERGENCIAS PNP</p><h1>{employee ? 'Panel de denuncias' : 'Mis denuncias'}</h1>
      <p>{employee ? 'Revisa reportes y deriva a EsSalud los casos con lesionados.' : 'Consulta los estados y modifica una denuncia mientras siga registrada.'}</p>
    </div>
    <Feedback error={error} info={info} />
    {editing && <form className="panel form-grid two-columns edit-form" onSubmit={saveText}>
      <label>Lugar<input name="lugar" defaultValue={editing.lugar_incidente} required /></label>
      <label className="wide">Detalle<textarea name="detalle" defaultValue={editing.detalle_denuncia} rows="3" required /></label>
      <button className="button button-primary">Guardar cambios</button>
      <button className="button button-quiet" type="button" onClick={() => setEditing(null)}>Cancelar</button>
    </form>}
    {rows.length === 0 ? <p className="empty">No hay denuncias para mostrar.</p> : <div className="table-wrap">
      <table><thead><tr><th>Código / Denunciante</th><th>Incidente</th><th>Puesto</th><th>Lesionados</th><th>Estado</th><th>Cita</th><th>Acciones</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.id}>
          <td><strong>{row.codigo_seguimiento}</strong><small>{row.denunciante}</small></td>
          <td>{row.tipo_delito}<small>{row.lugar_incidente}</small></td>
          <td>{row.puesto || '—'}</td><td><span className={row.hay_lesionados ? 'signal-danger' : ''}>{row.hay_lesionados ? 'Sí' : 'No'}</span></td><td><Status>{row.estado}</Status></td>
          <td>{row.codigo_cita ? <span className="link-live">{row.codigo_cita}<small><Status>{row.estado_cita}</Status></small></span> : '—'}</td>
          <td className="actions">
            {employee ? <>
              {row.estado === 'registrado' && <button className="small-button" onClick={() => updateStatus(row, 'en investigación')}>Investigar</button>}
              {row.estado !== 'atendido' && <button className="small-button" onClick={() => updateStatus(row, 'atendido')}>Atender</button>}
              <DerivarEssalud denuncia={row} onDone={(message) => { setInfo(message); load().catch((e) => setError(e.message)); }} onError={setError} />
            </> : row.estado === 'registrado' ? <button className="small-button" onClick={() => setEditing(row)}>Editar</button> : '—'}
          </td>
        </tr>)}</tbody>
      </table>
    </div>}
  </>;
}

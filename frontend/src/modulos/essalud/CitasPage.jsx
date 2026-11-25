import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api, jsonBody } from '../../api/client.js';
import { Feedback, Status } from '../../components/Feedback.jsx';

export default function CitasPage({ employee = false }) {
  const location = useLocation();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [info, setInfo] = useState(location.state?.info || '');
  const [editing, setEditing] = useState(null);
  const load = useCallback(() => api('/essalud/citas').then(({ citas }) => setRows(citas)), []);
  useEffect(() => { load().catch((requestError) => setError(requestError.message)); }, [load]);
  async function save(event) {
    event.preventDefault();
    setError('');
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await api(`/essalud/citas/${editing.id}`, { method: 'PUT', body: jsonBody(values) });
      setEditing(null);
      setInfo('Cita actualizada.');
      await load();
    } catch (requestError) { setError(requestError.message); }
  }
  async function update(id, estado) {
    setError('');
    try {
      await api(`/essalud/citas/${id}/estado`, { method: 'PATCH', body: jsonBody({ estado }) });
      setInfo(`Cita actualizada: ${estado}.`);
      await load();
    } catch (requestError) { setError(requestError.message); }
  }
  return <>
    <div className="page-title"><p className="eyebrow">ESSALUD NORTE CHICO</p><h1>{employee ? 'Panel de citas' : 'Mis citas'}</h1>
      <p>Las citas derivadas desde la PNP conservan el código de la denuncia relacionada.</p>
    </div>
    <Feedback error={error} info={info} />
    {editing && <form className="panel form-grid two-columns edit-form" onSubmit={save}>
      <label>Asegurado<input name="numero_asegurado" defaultValue={editing.numero_asegurado} required /></label>
      <label>Paciente<input name="nombre_paciente" defaultValue={editing.nombre_paciente} required /></label>
      <label>Sede<input name="sede" defaultValue={editing.sede} required /></label>
      <label>Tipo<select name="tipo_asegurado" defaultValue={editing.tipo_asegurado}><option value="titular">Titular</option><option value="derechohabiente">Derechohabiente</option></select></label>
      <label>Especialidad<input name="especialidad" defaultValue={editing.especialidad} required /></label>
      <label>Motivo<input name="motivo" defaultValue={editing.motivo} /></label>
      <button className="button button-primary">Guardar cambios</button>
      <button className="button button-quiet" type="button" onClick={() => setEditing(null)}>Cancelar</button>
    </form>}
    {rows.length === 0 ? <p className="empty">No hay citas para mostrar.</p> : <div className="table-wrap">
      <table><thead><tr><th>Código / Paciente</th><th>Especialidad</th><th>Sede</th><th>Origen</th><th>Estado</th><th>Acción</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.id}>
          <td><strong>{row.codigo_seguimiento}</strong><small>{row.nombre_paciente}</small></td><td>{row.especialidad}</td><td>{row.sede}</td>
          <td>{row.codigo_denuncia ? <span className="link-live">{row.codigo_denuncia}</span> : 'Solicitud directa'}</td><td><Status>{row.estado}</Status></td>
          <td>{employee && row.estado !== 'atendida' && row.estado !== 'cancelada'
            ? <div className="actions"><button className="small-button" onClick={() => update(row.id, 'confirmada')}>Confirmar</button><button className="small-button" onClick={() => update(row.id, 'atendida')}>Atender</button></div>
            : !employee && row.estado === 'registrado' && row.estado_pago !== 'pagado' && !row.id_denuncia
              ? <button className="small-button" onClick={() => setEditing(row)}>Actualizar</button>
              : '—'}</td>
        </tr>)}</tbody>
      </table>
    </div>}
  </>;
}

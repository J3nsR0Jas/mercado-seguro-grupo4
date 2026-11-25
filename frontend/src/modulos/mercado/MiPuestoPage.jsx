import { useCallback, useEffect, useState } from 'react';
import { api, jsonBody } from '../../api/client.js';
import { Feedback, Status } from '../../components/Feedback.jsx';
import DenunciaPuesto from '../../integraciones/DenunciaPuesto.jsx';
import { Link, useLocation } from 'react-router-dom';

export default function MiPuestoPage() {
  const location = useLocation();
  const [data, setData] = useState({ puestos: [], denuncias: [], citas: [], pagos: [] });
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [info, setInfo] = useState(location.state?.info || '');
  const load = useCallback(() => api('/mercado/mi-puesto').then(setData), []);
  useEffect(() => {
    load().catch((requestError) => setError(requestError.message));
  }, [load]);
  async function saveStall(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setError('');
    const values = Object.fromEntries(new FormData(formElement));
    values.area_m2 = Number(values.area_m2);
    values.dias = Number(values.dias);
    values.alto_consumo = values.alto_consumo === 'on';
    try {
      await api(`/mercado/comerciantes/${editing.id}`, { method: 'PUT', body: jsonBody(values) });
      setEditing(null);
      setInfo('Puesto actualizado.');
      await load();
    } catch (requestError) { setError(requestError.message); }
  }
  return <>
    <div className="page-title"><p className="eyebrow">MERCADO MAYORISTA</p><h1>Mi puesto</h1><p>Tus puestos, denuncias y citas en un solo lugar.</p></div>
    <Feedback error={error} info={info} />
    {editing && <form className="panel form-grid two-columns edit-form" onSubmit={saveStall}>
      <label>Razón social<input name="razon_social" defaultValue={editing.razon_social} required /></label>
      <label>Producto<input name="producto" defaultValue={editing.producto} required /></label>
      <label>Teléfono<input name="telefono" defaultValue={editing.telefono} required /></label>
      <label>Dirección<input name="direccion" defaultValue={editing.direccion} required /></label>
      <label>Puesto<input name="puesto" defaultValue={editing.puesto} required /></label>
      <label>Área (m²)<input name="area_m2" type="number" min="1" step="0.5" defaultValue={editing.area_m2} required /></label>
      <label>Días<input name="dias" type="number" min="1" max="365" defaultValue={editing.dias} required /></label>
      <label className="check-label"><input name="alto_consumo" type="checkbox" defaultChecked={editing.alto_consumo} /> Alto consumo</label>
      <button className="button button-primary">Guardar cambios</button>
      <button className="button button-quiet" type="button" onClick={() => setEditing(null)}>Cancelar</button>
    </form>}
    <section className="section">
      <h2>Puestos registrados</h2>
      {data.puestos.length === 0 ? <p className="empty">Todavía no tienes puestos registrados.</p> : <div className="record-grid">
        {data.puestos.map((stall) => <article className="record-card" key={stall.id}>
          <div className="record-top"><h3>{stall.razon_social}</h3><Status>{stall.estado}</Status></div>
          <p>{stall.producto} · Puesto {stall.puesto}</p><p className="muted">{stall.direccion}</p>
          <p><strong>Monto estimado:</strong> S/ {Number(stall.monto_calculado).toFixed(2)} · <strong>Pago:</strong> <Status>{data.pagos.some((payment) => String(payment.id_comerciante) === String(stall.id)) ? 'simulado' : stall.estado_pago}</Status></p>
          <code>{stall.codigo_seguimiento}</code>
          <div className="record-actions actions">
            {stall.estado === 'registrado' && <button className="small-button" onClick={() => setEditing(stall)}>Actualizar</button>}
            {!data.pagos.some((payment) => String(payment.id_comerciante) === String(stall.id)) && <Link className="small-button" to={`/mercado/pago/${stall.id}`}>Pago con tarjeta (demo)</Link>}
            <DenunciaPuesto id={stall.id} />
          </div>
        </article>)}
      </div>}
    </section>
    <section className="section">
      <h2>Denuncias y atención</h2>
      {data.denuncias.length === 0 ? <p className="empty">Las denuncias vinculadas aparecerán aquí.</p> : <div className="table-wrap">
        <table><thead><tr><th>Código</th><th>Puesto</th><th>Incidente</th><th>Denuncia</th><th>Cita EsSalud</th></tr></thead>
          <tbody>{data.denuncias.map((item) => <tr key={item.id}>
            <td>{item.codigo_seguimiento}</td><td>{item.puesto || '—'}</td><td>{item.tipo_delito}</td>
            <td><Status>{item.estado}</Status></td><td>{item.codigo_cita ? <>{item.codigo_cita} · <Status>{item.estado_cita}</Status></> : '—'}</td>
          </tr>)}</tbody>
        </table>
      </div>}
    </section>
  </>;
}

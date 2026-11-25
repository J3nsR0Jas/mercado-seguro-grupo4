import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { Feedback } from '../components/Feedback.jsx';

export default function ReporteSeguridad() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api('/mercado/seguridad').then(({ reporte }) => setRows(reporte)).catch((requestError) => setError(requestError.message));
  }, []);
  return <>
    <div className="page-title"><p className="eyebrow">MERCADO MAYORISTA · ADMINISTRADOR</p><h1>Reporte de seguridad</h1><p>Denuncias por puesto (JOIN + COUNT / GROUP BY).</p></div>
    <Feedback error={error} />
    <div className="table-wrap"><table><thead><tr><th>Comerciante</th><th>Puesto</th><th>Dirección</th><th>Incidentes</th><th>Abiertos</th></tr></thead>
      <tbody>{rows.map((row) => <tr key={row.id}><td>{row.razon_social}</td><td>{row.puesto}</td><td>{row.direccion}</td><td><strong>{row.denuncias}</strong></td><td>{row.abiertas}</td></tr>)}</tbody>
    </table></div>
  </>;
}

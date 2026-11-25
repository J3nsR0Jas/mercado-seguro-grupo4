import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { Feedback, Status } from '../../components/Feedback.jsx';

export default function ListaPuestosPage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api('/mercado/comerciantes').then(({ puestos }) => setRows(puestos)).catch((requestError) => setError(requestError.message));
  }, []);
  return <>
    <div className="page-title"><p className="eyebrow">MERCADO MAYORISTA · EMPLEADO</p><h1>Solicitudes de puestos</h1></div>
    <Feedback error={error} />
    <div className="table-wrap"><table><thead><tr><th>Comerciante</th><th>Rubro</th><th>Puesto</th><th>Estado</th><th>Código</th></tr></thead>
      <tbody>{rows.map((row) => <tr key={row.id}><td>{row.razon_social}</td><td>{row.producto}</td><td>{row.puesto}</td><td><Status>{row.estado}</Status></td><td>{row.codigo_seguimiento}</td></tr>)}</tbody>
    </table></div>
  </>;
}

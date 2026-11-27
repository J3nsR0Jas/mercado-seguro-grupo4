import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { Feedback, Status } from '../../components/Feedback.jsx';

export default function ListaPuestosPage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  useEffect(() => {
    api('/mercado/comerciantes').then(({ puestos }) => setRows(puestos)).catch((requestError) => setError(requestError.message));
  }, []);
  const statuses = [...new Set(rows.map((row) => row.estado))];
  const filteredRows = rows.filter((row) => {
    const matchesStatus = statusFilter === 'Todos' || row.estado === statusFilter;
    const matchesQuery = `${row.razon_social} ${row.producto} ${row.puesto} ${row.codigo_seguimiento}`.toLowerCase().includes(query.toLowerCase());
    return matchesStatus && matchesQuery;
  });
  return <>
    <div className="page-title"><p className="eyebrow">MERCADO MAYORISTA · EMPLEADO</p><h1>Solicitudes de puestos</h1></div>
    <Feedback error={error} />
    <div className="stall-filters">
      <label>Buscar comerciante, rubro o código<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Escribe para filtrar" /></label>
      <label>Estado<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>Todos</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
      <span>{filteredRows.length} de {rows.length} solicitudes</span>
    </div>
    <div className="table-wrap"><table><thead><tr><th>Comerciante</th><th>Rubro</th><th>Puesto</th><th>Estado</th><th>Código</th></tr></thead>
      <tbody>{filteredRows.map((row) => <tr key={row.id}><td>{row.razon_social}</td><td>{row.producto}</td><td>{row.puesto}</td><td><Status>{row.estado}</Status></td><td>{row.codigo_seguimiento}</td></tr>)}</tbody>
    </table></div>
    {filteredRows.length === 0 && <p className="empty">No hay solicitudes que coincidan con los filtros.</p>}
  </>;
}

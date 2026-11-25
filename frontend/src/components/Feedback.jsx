export function Feedback({ error, info }) {
  if (!error && !info) return null;
  return <p className={error ? 'feedback error' : 'feedback'} role={error ? 'alert' : 'status'}>{error || info}</p>;
}

export function Status({ children }) {
  const value = String(children || 'registrado').toLowerCase();
  const color = value.includes('rechaz') || value === 'cancelada' ? 'red'
    : value.includes('investig') || value === 'derivado' || value === 'pendiente' ? 'amber'
      : value === 'atendido' || value === 'aprobado' || value === 'pagado' || value === 'confirmada' ? 'green'
        : 'gray';
  return <span className={`status ${color}`}>{children || 'registrado'}</span>;
}

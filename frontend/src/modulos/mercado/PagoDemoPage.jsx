import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../api/client.js';
import { Feedback } from '../../components/Feedback.jsx';

export default function PagoDemoPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => api('/mercado/mi-puesto').then(setData), []);
  useEffect(() => {
    load().catch((requestError) => setError(requestError.message));
  }, [load]);

  const stall = data?.puestos.find((item) => String(item.id) === String(id));
  const priorPayment = data?.pagos.find((item) => String(item.id_comerciante) === String(id));
  const completedPayment = payment || priorPayment;

  async function simulatePayment() {
    setError('');
    setBusy(true);
    try {
      const { pago } = await api(`/mercado/comerciantes/${id}/pago-demo`, { method: 'POST' });
      setPayment(pago);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  if (!data && !error) return <p className="loading">Cargando solicitud...</p>;

  return <>
    <div className="page-title"><p className="eyebrow">MERCADO MAYORISTA · TARJETA</p><h1>Pago demostrativo</h1><p>Este flujo sirve únicamente para probar la integración. No se realizará un cargo real.</p></div>
    <Feedback error={error} />
    {!stall && !error && <p className="empty">No se encontró el puesto asociado a tu cuenta.</p>}
    {stall && <section className="payment-layout">
      <article className="portal-card payment-summary">
        <p className="eyebrow">RESUMEN DE SOLICITUD</p>
        <h2>{stall.razon_social}</h2>
        <p>Puesto {stall.puesto} · {stall.producto}</p>
        <p>{stall.area_m2} m² · {stall.dias} {stall.dias === 1 ? 'día' : 'días'}</p>
        <p className="payment-total">S/ {Number(stall.monto_calculado).toFixed(2)}</p>
        <p className="hint">Importe calculado por la API. El pago simulado no cambia el estado oficial del puesto.</p>
      </article>
      <article className="portal-card payment-method">
        <p className="eyebrow">MÉTODO DE PAGO</p>
        <h2>Tarjeta de crédito o débito</h2>
        <div className="demo-card" aria-label="Tarjeta de pago de demostración">
          <span>MERCADO SEGURO</span><strong>•••• •••• •••• DEMO</strong><small>ENTORNO DE PRUEBA</small>
        </div>
        <p>Para proteger tus datos, este prototipo no solicita ni almacena número de tarjeta, vencimiento o CVV.</p>
        {completedPayment
          ? <div className="feedback" role="status">Simulación registrada · operación {completedPayment.codigo_operacion}. No se realizó ningún cargo.</div>
          : <button className="button button-primary full" onClick={simulatePayment} disabled={busy || !stall}>
            {busy ? 'Registrando simulación…' : 'Simular pago con tarjeta'}
          </button>}
        <p className="hint">El registro queda marcado como simulado en Neon; para cobrar de verdad se necesita integrar una pasarela.</p>
      </article>
    </section>}
    <Link className="text-link" to="/mercado/mi-puesto">← Volver a mis puestos</Link>
  </>;
}

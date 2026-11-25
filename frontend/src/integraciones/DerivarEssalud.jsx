import { api } from '../api/client.js';

export default function DerivarEssalud({ denuncia, onDone, onError }) {
  const derive = async () => {
    try {
      await api(`/pnp/denuncias/${denuncia.id}/derivar`, { method: 'POST' });
      onDone('Cita creada y vinculada a la denuncia.');
    } catch (error) {
      onError(error.message);
    }
  };
  return <button className="button button-secondary" onClick={derive} disabled={!denuncia.hay_lesionados || Boolean(denuncia.codigo_cita)}>
    {denuncia.codigo_cita ? 'Cita vinculada' : 'Derivar a EsSalud'}
  </button>;
}

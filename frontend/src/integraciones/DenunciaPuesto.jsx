import { useNavigate } from 'react-router-dom';

export default function DenunciaPuesto({ id }) {
  const navigate = useNavigate();
  return <button className="button button-secondary" onClick={() => navigate(`/pnp/denuncia?id_comerciante=${id}`)}>
    Denunciar incidente
  </button>;
}

import { Outlet, useLocation } from 'react-router-dom';
import MenuRoles from './MenuRoles.jsx';

const moduleLabels = {
  mercado: 'Mercado',
  pnp: 'PNP',
  essalud: 'EsSalud',
  perfil: 'Mi perfil'
};

export default function AppShell() {
  const location = useLocation();
  const moduleId = location.pathname.split('/')[1];
  const moduleName = moduleLabels[moduleId] || 'Inicio';
  const theme = ['mercado', 'pnp', 'essalud'].includes(moduleId) ? `tema-${moduleId}` : 'tema-general';

  return (
    <div className={`app-shell ${theme}`}>
      <MenuRoles />
      <main className="page" key={location.pathname}>
        <p className="breadcrumb">Mercado Seguro <span>›</span> {moduleName}</p>
        <Outlet />
      </main>
      <footer className="footer">Grupo 4 · Mercado Mayorista · PNP · EsSalud</footer>
    </div>
  );
}

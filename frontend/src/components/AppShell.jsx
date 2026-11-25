import { Outlet, useLocation } from 'react-router-dom';
import MenuRoles from './MenuRoles.jsx';

export default function AppShell() {
  const location = useLocation();
  const moduleName = location.pathname.split('/')[1] || 'Inicio';
  return (
    <>
      <MenuRoles />
      <main className="page">
        <p className="breadcrumb">Mercado Seguro <span>›</span> {moduleName}</p>
        <Outlet />
      </main>
      <footer className="footer">Grupo 4 · Mercado Mayorista · PNP · EsSalud</footer>
    </>
  );
}

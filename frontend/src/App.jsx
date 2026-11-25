import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import HomePage from './modulos/HomePage.jsx';
import LoginPage from './modulos/LoginPage.jsx';
import RegistroPage from './modulos/mercado/RegistroPage.jsx';
import MiPuestoPage from './modulos/mercado/MiPuestoPage.jsx';
import ListaPuestosPage from './modulos/mercado/ListaPuestosPage.jsx';
import SeguridadPage from './modulos/mercado/SeguridadPage.jsx';
import DenunciaPage from './modulos/pnp/DenunciaPage.jsx';
import DenunciasPage from './modulos/pnp/DenunciasPage.jsx';
import CitaPage from './modulos/essalud/CitaPage.jsx';
import CitasPage from './modulos/essalud/CitasPage.jsx';
import MercadoPortalPage from './modulos/mercado/PortalPage.jsx';
import PnpPortalPage from './modulos/pnp/PortalPage.jsx';
import EssaludPortalPage from './modulos/essalud/PortalPage.jsx';
import PagoDemoPage from './modulos/mercado/PagoDemoPage.jsx';
import './styles.css';

function Landing() {
  const { user, loading } = useAuth();
  if (loading) return <p className="loading">Comprobando sesión...</p>;
  return user ? <HomePage /> : <LoginPage />;
}

function AppRoutes() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/registro" element={<LoginPage register />} />
    <Route element={<RutaProtegida />}>
      <Route element={<AppShell />}>
        <Route path="/" element={<Landing />} />
      </Route>
    </Route>
    <Route element={<RutaProtegida modulo="mercado" roles={['cliente', 'empleado', 'administrador']} />}>
      <Route element={<AppShell />}>
        <Route path="/mercado" element={<MercadoPortalPage />} />
        <Route path="/mercado/registro" element={<RegistroPage />} />
        <Route path="/mercado/mi-puesto" element={<MiPuestoPage />} />
        <Route path="/mercado/pago/:id" element={<PagoDemoPage />} />
        <Route path="/mercado/registros" element={<ListaPuestosPage />} />
        <Route path="/mercado/seguridad" element={<SeguridadPage />} />
      </Route>
    </Route>
    <Route element={<RutaProtegida modulo="pnp" roles={['cliente', 'empleado']} />}>
      <Route element={<AppShell />}>
        <Route path="/pnp" element={<PnpPortalPage />} />
        <Route path="/pnp/denuncia" element={<DenunciaPage />} />
        <Route path="/pnp/mis-denuncias" element={<DenunciasPage />} />
        <Route path="/pnp/panel" element={<DenunciasPage employee />} />
      </Route>
    </Route>
    <Route element={<RutaProtegida modulo="essalud" roles={['cliente', 'empleado']} />}>
      <Route element={<AppShell />}>
        <Route path="/essalud" element={<EssaludPortalPage />} />
        <Route path="/essalud/cita" element={<CitaPage />} />
        <Route path="/essalud/mis-citas" element={<CitasPage />} />
        <Route path="/essalud/panel" element={<CitasPage employee />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}

export default function App() {
  return <AuthProvider><BrowserRouter><AppRoutes /></BrowserRouter></AuthProvider>;
}

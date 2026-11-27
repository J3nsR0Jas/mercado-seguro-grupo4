import { useEffect, useRef } from 'react';
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
  const pageRef = useRef(null);
  const moduleId = location.pathname.split('/')[1];
  const moduleName = moduleLabels[moduleId] || 'Inicio';
  const theme = ['mercado', 'pnp', 'essalud'].includes(moduleId) ? `tema-${moduleId}` : 'tema-general';

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;
    const revealTargets = page.querySelectorAll([
      ':scope > .hero',
      ':scope > .section',
      ':scope > .home-citizen-spotlight',
      ':scope > .portal-hero',
      ':scope > .portal-grid',
      ':scope > .market-products',
      ':scope > .market-offers',
      ':scope > .online-market-section',
      ':scope > .market-reference-section',
      ':scope > .market-events-section',
      ':scope > .institutional-portal > .institutional-hero',
      ':scope > .institutional-portal > .institutional-content-grid',
      ':scope > .institutional-portal > .pnp-information-section',
      ':scope > .institutional-portal > .health-flow-section',
      ':scope > .institutional-portal > .blood-donation-card',
      ':scope > .institutional-portal > .health-news-section',
      ':scope > .institutional-portal > .health-service-strip',
      ':scope > .institutional-portal > .pnp-guidance',
      '.module-grid > .module-card',
      '.product-grid > .product-card',
      '.portal-grid > .portal-card',
      '.institutional-news-grid > .institutional-news-card',
      '.portal-services > .portal-service',
      '.pnp-info-grid > article',
      '.event-grid > .market-event-card'
    ].join(','));

    if (!('IntersectionObserver' in window)) {
      revealTargets.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    revealTargets.forEach((element, index) => {
      element.classList.add('scroll-reveal');
      element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 55}ms`);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <div className={`app-shell ${theme}`}>
      <MenuRoles />
      <main className="page" key={location.pathname} ref={pageRef}>
        <p className="breadcrumb">Mercado Seguro <span>›</span> {moduleName}</p>
        <Outlet />
      </main>
      {moduleId === 'mercado'
        ? <footer className="market-footer" id="market-contacto">
          <div className="market-footer-main">
            <div className="market-footer-brand">
              <a className="market-footer-logo" href="/" aria-label="Mercado Seguro, inicio">
                <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 19 24 6l19 13v23H5z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" /><path d="M15 42V25h18v17M20 31h8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                <span>Mercado <strong>Seguro</strong><small>EMMSA · GMML</small></span>
              </a>
              <p>Av. La Cultura 808,<br />Santa Anita - Lima, Perú</p>
              <a className="market-footer-phone" href="tel:+015182800">+01 518-2800</a>
            </div>
            <nav className="market-footer-links" aria-label="Enlaces institucionales">
              <div><h2>Contáctanos</h2><a href="https://www.gob.pe/1120-presentar-un-reclamo-en-el-libro-de-reclamaciones" target="_blank" rel="noreferrer">Libro de Reclamaciones</a><a href="https://denuncias.servicios.gob.pe/" target="_blank" rel="noreferrer">Canal de Denuncias</a></div>
              <div><h2>Infórmate</h2><a href="/">Inicio</a><a href="https://www.gob.pe/institucion/emmsa/noticias" target="_blank" rel="noreferrer">Noticias</a><a href="https://www.transparencia.gob.pe/" target="_blank" rel="noreferrer">Transparencia</a></div>
              <div><h2>Otros enlaces</h2><a href="https://www.munlima.gob.pe/" target="_blank" rel="noreferrer">Municipalidad de Lima</a><a href="https://www.gob.pe/midagri" target="_blank" rel="noreferrer">MIDAGRI</a><a href="https://www.gob.pe/pnp" target="_blank" rel="noreferrer">PNP</a><a href="https://www.essalud.gob.pe/" target="_blank" rel="noreferrer">EsSalud</a></div>
              <div><h2>Información y Consultas</h2><a href="/mercado#market-rules-heading">Reglamento Interno GMML</a><a href="/mercado#market-tramites">Atención al Comerciante</a></div>
            </nav>
          </div>
          <div className="market-footer-bottom">Gran Mercado Mayorista de Lima · Empresa Municipal de Mercados S.A.</div>
        </footer>
        : <footer className="footer">Grupo 4 · Mercado Mayorista · PNP · EsSalud</footer>}
    </div>
  );
}

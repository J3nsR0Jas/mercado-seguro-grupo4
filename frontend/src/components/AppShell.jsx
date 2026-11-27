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
      <footer className="footer">Grupo 4 · Mercado Mayorista · PNP · EsSalud</footer>
    </div>
  );
}

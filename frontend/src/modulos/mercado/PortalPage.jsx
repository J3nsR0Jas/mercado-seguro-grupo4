import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client.js';
import { Feedback, Status } from '../../components/Feedback.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const mapUrl = 'https://maps.google.com/maps?q=Mercado%20Mayorista%20de%20Lima%2C%20Santa%20Anita%2C%20Lima%2C%20Per%C3%BA&output=embed';
const directionsUrl = 'https://www.google.com/maps/search/?api=1&query=Mercado+Mayorista+de+Lima%2C+Santa+Anita%2C+Lima%2C+Peru';
const categories = [
  { id: 'tuberculos', label: 'Tubérculos', color: 'tubercles' },
  { id: 'frutas', label: 'Frutas', color: 'fruits' },
  { id: 'verduras', label: 'Verduras', color: 'vegetables' }
];
const products = [
  { id: 'papa-amarilla', name: 'Papa amarilla', category: 'tuberculos', price: 4.2, wholesale: 115, package: 'saco', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=85', offer: { previous: 4.8, price: 3.9 } },
  { id: 'papa-blanca', name: 'Papa blanca', category: 'tuberculos', price: 2.6, wholesale: 72, package: 'saco', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=85' },
  { id: 'camote', name: 'Camote', category: 'tuberculos', price: 2.9, wholesale: 78, package: 'saco', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=85' },
  { id: 'yuca', name: 'Yuca', category: 'tuberculos', price: 3.1, wholesale: 82, package: 'saco', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=800&q=85' },
  { id: 'olluco', name: 'Olluco', category: 'tuberculos', price: 3.8, wholesale: 101, package: 'saco', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=85' },
  { id: 'manzana', name: 'Manzana', category: 'frutas', price: 4.5, wholesale: 78, package: 'caja', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=85', offer: { previous: 5.2, price: 4.2 } },
  { id: 'platano', name: 'Plátano de seda', category: 'frutas', price: 2.8, wholesale: 54, package: 'caja', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=85' },
  { id: 'naranja', name: 'Naranja', category: 'frutas', price: 2.7, wholesale: 49, package: 'caja', image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=85' },
  { id: 'papaya', name: 'Papaya', category: 'frutas', price: 3.2, wholesale: 62, package: 'caja', image: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=800&q=85' },
  { id: 'pina', name: 'Piña', category: 'frutas', price: 3.6, wholesale: 66, package: 'caja', image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=85' },
  { id: 'palta', name: 'Palta', category: 'frutas', price: 6.5, wholesale: 125, package: 'caja', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=85' },
  { id: 'tomate', name: 'Tomate', category: 'verduras', price: 3.4, wholesale: 91, package: 'saco', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=85', offer: { previous: 4, price: 3.1 } },
  { id: 'cebolla', name: 'Cebolla', category: 'verduras', price: 2.8, wholesale: 75, package: 'saco', image: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=85' },
  { id: 'zanahoria', name: 'Zanahoria', category: 'verduras', price: 2.5, wholesale: 68, package: 'saco', image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=800&q=85' },
  { id: 'lechuga', name: 'Lechuga', category: 'verduras', price: 1.8, wholesale: 48, package: 'saco', image: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=800&q=85' },
  { id: 'brocoli', name: 'Brócoli', category: 'verduras', price: 3.8, wholesale: 102, package: 'saco', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=800&q=85' },
  { id: 'aji-amarillo', name: 'Ají amarillo', category: 'verduras', price: 5.5, wholesale: 145, package: 'saco', image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=85' }
];
const events = [
  { title: 'Feria de productores y cosecha de temporada', category: 'Feria agropecuaria', date: '2026-12-05', place: 'Santa Anita', image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=85' },
  { title: 'Rueda de negocio con agricultores locales', category: 'Rueda de negocio', date: '2026-12-12', place: 'Pabellón de productores', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=85' },
  { title: 'Capacitación de poscosecha y conservación', category: 'Capacitación agrícola', date: '2027-01-09', place: 'Aula de capacitación', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=85' },
  { title: 'Festival de cosecha y semillas nativas', category: 'Festival de cosecha', date: '2027-01-23', place: 'Plaza de productores', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=85' }
];
const categoryLabel = (category) => categories.find((item) => item.id === category)?.label ?? category;
const money = (amount) => `S/ ${amount.toFixed(2)}`;

export default function MercadoPortalPage() {
  const { user } = useAuth();
  const [stalls, setStalls] = useState([]);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('tuberculos');
  const [wholesaleMode, setWholesaleMode] = useState(false);
  const [cart, setCart] = useState({});
  const [orderMessage, setOrderMessage] = useState('');
  const [eventCategory, setEventCategory] = useState('Todas');
  const [eventDate, setEventDate] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const role = user?.roles.find((item) => item.modulo === 'mercado')?.rol;
  const hasAccess = Boolean(role);
  const canAccessPnp = user?.roles.some((item) => item.modulo === 'pnp');
  const canAccessEssalud = user?.roles.some((item) => item.modulo === 'essalud');

  useEffect(() => {
    setStalls([]);
    setError('');
    if (!hasAccess) return;
    api('/mercado/comerciantes')
      .then(({ puestos }) => setStalls(puestos))
      .catch((requestError) => setError(requestError.message));
  }, [user, hasAccess]);

  const actionPath = role === 'administrador' ? '/mercado/seguridad'
    : role === 'empleado' ? '/mercado/registros'
      : '/mercado/mi-puesto';
  const visibleProducts = products.filter((product) => product.category === activeCategory);
  const offerProducts = products.filter((product) => product.offer);
  const cartItems = Object.entries(cart).map(([id, quantity]) => ({ product: products.find((item) => item.id === id), quantity })).filter((item) => item.product);
  const subtotal = cartItems.reduce((sum, { product, quantity }) => {
    const unitPrice = wholesaleMode ? product.wholesale : (product.offer?.price ?? product.price);
    return sum + unitPrice * quantity;
  }, 0);
  const filteredEvents = useMemo(() => events.filter((event) => {
    const matchesCategory = eventCategory === 'Todas' || event.category === eventCategory;
    const matchesDate = !eventDate || event.date >= eventDate;
    const matchesSearch = `${event.title} ${event.place} ${event.category}`.toLowerCase().includes(eventSearch.toLowerCase());
    return matchesCategory && matchesDate && matchesSearch;
  }), [eventCategory, eventDate, eventSearch]);

  function addToCart(product) {
    setOrderMessage('');
    setCart((current) => {
      const minimum = wholesaleMode && product.category !== 'frutas' ? 9 : 1;
      return { ...current, [product.id]: Math.max(minimum, (current[product.id] ?? 0) + 1) };
    });
  }

  function updateQuantity(product, change) {
    setOrderMessage('');
    setCart((current) => {
      const minimum = wholesaleMode && product.category !== 'frutas' ? 9 : 1;
      const next = (current[product.id] ?? minimum) + change;
      if (next < minimum) {
        const { [product.id]: removed, ...remaining } = current;
        return remaining;
      }
      return { ...current, [product.id]: next };
    });
  }

  function enableWholesaleMode() {
    setWholesaleMode(true);
    setOrderMessage('');
    setCart((current) => Object.fromEntries(Object.entries(current).map(([id, quantity]) => {
      const product = products.find((item) => item.id === id);
      return [id, product && product.category !== 'frutas' ? Math.max(9, quantity) : Math.max(1, quantity)];
    })));
  }

  function confirmOrder() {
    const invalid = cartItems.some(({ product, quantity }) => wholesaleMode
      ? product.category === 'frutas' ? quantity < 1 : quantity < 9
      : quantity < 1);
    if (invalid || cartItems.length === 0) {
      setOrderMessage('Revisa las cantidades mínimas y agrega productos antes de confirmar.');
      return;
    }
    setOrderMessage(`Pedido demostrativo preparado por ${money(subtotal)}. No se realizó un pago ni se envió a la API.`);
    setCart({});
  }

  return <>
    <section className="portal-hero market-portal">
      <div className="portal-hero-content">
        <p className="portal-kicker"><span className="market-emblem" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path fill="currentColor" d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg></span> EMPRESA MUNICIPAL DE MERCADOS · SANTA ANITA</p>
        <h1>El centro de abastecimiento más grande del país</h1>
        <p>Conectando productores, comerciantes y familias peruanas con productos frescos de la mejor calidad al por mayor.</p>
        <div className="actions">
          {hasAccess
            ? <><Link className="button button-primary" to={role === 'cliente' ? '/mercado/registro' : actionPath}>
              {role === 'cliente' ? 'Registrar un puesto' : 'Abrir mi espacio de trabajo'}
            </Link><Link className="button button-secondary" to={actionPath}>Ver mis servicios</Link></>
            : user
              ? <Link className="button button-secondary" to="/">Volver a mis servicios</Link>
              : <Link className="button button-primary" to="/login?modulo=mercado">Iniciar sesión</Link>}
        </div>
      </div>
      <div className="market-hero-visual">
        <img className="portal-hero-image" src="/images/mercado-hero.jpg" alt="Camiones y pabellones del Mercado Mayorista de Lima" />
        <svg className="market-moving-cart" viewBox="0 0 120 90" role="img" aria-label="Carrito de compras en movimiento">
          <path d="M8 12h12l10 46h58l14-34H26" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="40" cy="73" r="7" fill="currentColor" /><circle cx="82" cy="73" r="7" fill="currentColor" />
          <path d="M43 40h35M52 30v22M67 30v22" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>
    </section>

    <Feedback error={error} />

    <section className="portal-grid section">
      {hasAccess ? <article className="portal-card">
        <p className="eyebrow">GESTIÓN DIGITAL</p>
        <h2>Trámites del mercado</h2>
        <p>Registra y actualiza puestos, revisa su estado y consulta las incidencias enlazadas con PNP y EsSalud.</p>
        <p className="portal-metric"><strong>{stalls.length}</strong><span>solicitudes visibles en tu perfil</span></p>
        {stalls.slice(0, 3).map((stall) => <p className="portal-row" key={stall.id}>
          <span>{stall.puesto} · {stall.razon_social}</span><Status>{stall.estado}</Status>
        </p>)}
      </article> : <article className="portal-card">
        <p className="eyebrow">SERVICIOS PARA COMERCIANTES</p>
        <h2>Trámites digitales</h2>
        <p>{user ? 'Inicia sesión con una cuenta que tenga acceso al módulo Mercado para gestionar tus trámites.' : 'Inicia sesión para registrar solicitudes, consultar tus puestos y revisar el estado de tus trámites.'}</p>
        {user
          ? <Link className="text-link" to="/">Volver a mis servicios →</Link>
          : <Link className="text-link" to="/login?modulo=mercado">Iniciar sesión en Mercado →</Link>}
      </article>}
      <article className="portal-card">
        <p className="eyebrow">UBICACIÓN</p>
        <h2>Encuentra el mercado</h2>
        <p>Mercado Mayorista de Lima, distrito de Santa Anita.</p>
        <img className="market-pavilion-image" src="/images/mercado-pabellon.jpg" alt="Comerciantes y pabellones de productos frescos" loading="lazy" />
        <div className="map-frame">
          <iframe title="Mapa del Mercado Mayorista de Lima en Santa Anita" src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
        <a className="text-link" href={directionsUrl} target="_blank" rel="noreferrer">Abrir indicaciones en Google Maps ↗</a>
      </article>
    </section>

    <section className="section market-products" aria-labelledby="market-catalog-heading">
      <div className="section-heading">
        <div><p className="eyebrow">FRESCOS Y AL POR MAYOR</p><h2 id="market-catalog-heading">Catálogo de productos agrícolas</h2></div>
      </div>
      <div className="category-tabs" role="tablist" aria-label="Categorías de productos">
        {categories.map((category) => <button
          className={`category-tab ${category.color}${activeCategory === category.id ? ' selected' : ''}`}
          key={category.id}
          type="button"
          role="tab"
          aria-selected={activeCategory === category.id}
          onClick={() => setActiveCategory(category.id)}
        >{category.label}</button>)}
      </div>
      <div className="product-grid market-catalog-grid">
        {visibleProducts.map((product) => <article className="product-card market-product-card" key={product.id}>
          <img src={product.image} alt={product.name} loading="lazy" />
          <div className="product-card-info">
            <p className={`eyebrow product-category-${product.category}`}>{categoryLabel(product.category)}</p>
            <h3>{product.name}</h3>
            {product.offer
              ? <p className="product-price"><del>{money(product.offer.previous)} / kg</del><strong>{money(product.offer.price)} / kg</strong><span className="offer-badge">OFERTA</span></p>
              : <strong className="product-price-standard">{money(product.price)} / kg</strong>}
            <small>Mayorista: {money(product.wholesale)} / {product.package}</small>
            <button className="button button-primary" type="button" onClick={() => addToCart(product)}>Agregar al carrito</button>
          </div>
        </article>)}
      </div>
      <p className="product-disclaimer">Precios referenciales; varían según temporada, calidad, origen y volumen. Confirma con el comerciante antes de comprar.</p>
    </section>

    <section className="section market-offers" aria-labelledby="market-offers-heading">
      <div className="section-heading"><div><p className="eyebrow">VIGENTES EN ESTE CATÁLOGO</p><h2 id="market-offers-heading">Ofertas del día</h2></div></div>
      <div className="offer-list">
        {offerProducts.map((product) => <article className="offer-row" key={product.id}>
          <img src={product.image} alt="" loading="lazy" />
          <div><span className="offer-badge">PRECIO PROMOCIONAL</span><h3>{product.name}</h3><span><del>{money(product.offer.previous)} / kg</del> <strong>{money(product.offer.price)} / kg</strong></span></div>
          <button className="button button-secondary" type="button" onClick={() => { setActiveCategory(product.category); addToCart(product); }}>Agregar oferta</button>
        </article>)}
      </div>
    </section>

    <section className="section online-market-section" aria-labelledby="market-cart-heading">
      <div className="section-heading"><div><p className="eyebrow">COMPRA EN LÍNEA · DEMOSTRACIÓN LOCAL</p><h2 id="market-cart-heading">Tu carrito mayorista</h2></div></div>
      <div className="order-mode-switch" role="group" aria-label="Tipo de pedido">
        <button className={`category-tab ${!wholesaleMode ? 'selected' : ''}`} type="button" aria-pressed={!wholesaleMode} onClick={() => { setWholesaleMode(false); setOrderMessage(''); }}>Compra por kilo</button>
        <button className={`category-tab ${wholesaleMode ? 'selected' : ''}`} type="button" aria-pressed={wholesaleMode} onClick={enableWholesaleMode}>Pedido para proveedor</button>
      </div>
      {wholesaleMode && <div className="wholesale-rule"><strong>Reglas de pedido al por mayor:</strong> tubérculos y verduras, mínimo 9 sacos por producto (más de 8); frutas, mínimo 1 caja. Puedes ajustar cantidades antes de confirmar.</div>}
      {cartItems.length === 0
        ? <p className="empty">Tu carrito está vacío. Agrega productos desde el catálogo.</p>
        : <div className="cart-panel">
          {cartItems.map(({ product, quantity }) => {
            const unit = wholesaleMode ? product.package : 'kg';
            const unitPrice = wholesaleMode ? product.wholesale : (product.offer?.price ?? product.price);
            const minimum = wholesaleMode && product.category !== 'frutas' ? 9 : 1;
            return <div className="cart-line" key={product.id}>
              <div><strong>{product.name}</strong><small>{money(unitPrice)} / {unit} · {categoryLabel(product.category)}</small></div>
              <div className="cart-quantity">
                <button className="small-button" type="button" aria-label={`Quitar una unidad de ${product.name}`} onClick={() => updateQuantity(product, -1)}>−</button>
                <span>{quantity} {unit}{quantity !== 1 ? 's' : ''}</span>
                <button className="small-button" type="button" aria-label={`Agregar una unidad de ${product.name}`} onClick={() => updateQuantity(product, 1)}>+</button>
                {wholesaleMode && <small>Mín. {minimum}</small>}
              </div>
              <strong>{money(unitPrice * quantity)}</strong>
            </div>;
          })}
          <div className="cart-totals"><span>Subtotal</span><strong>{money(subtotal)}</strong><span>Total estimado</span><strong>{money(subtotal)}</strong></div>
          <button className="button button-primary" type="button" onClick={confirmOrder}>Validar y confirmar pedido</button>
        </div>}
      {orderMessage && <p className="feedback" role="status">{orderMessage}</p>}
      <p className="hint">Este prototipo calcula importes en el navegador; no procesa pagos ni registra pedidos en el servidor.</p>
    </section>

    <section className="section market-reference-section" aria-labelledby="market-rules-heading">
      <div className="section-heading"><div><p className="eyebrow">INFORMACIÓN REFERENCIAL</p><h2 id="market-rules-heading">Precios mayoristas y normas internas</h2></div></div>
      <div className="market-reference-grid">
        <div className="table-wrap"><table><thead><tr><th>Producto / presentación</th><th>Unidad</th><th>Precio referencial</th></tr></thead><tbody>
          <tr><td>Papa blanca</td><td>Kilo</td><td>S/ 2.60</td></tr><tr><td>Papa amarilla</td><td>Saco</td><td>S/ 115.00</td></tr><tr><td>Tomate</td><td>Saco</td><td>S/ 91.00</td></tr><tr><td>Manzana</td><td>Caja</td><td>S/ 78.00</td></tr><tr><td>Plátano de seda</td><td>Caja</td><td>S/ 54.00</td></tr>
        </tbody></table></div>
        <article className="market-rules-card"><h3>Reglas para una operación segura</h3><ul><li>Realiza carga y descarga dentro de los horarios y zonas que establezca la administración.</li><li>Mantén el puesto y los pasillos limpios; separa residuos y evita obstruir salidas.</li><li>Verifica la calibración de balanzas y acuerda por escrito la unidad y calidad del producto.</li><li>Sigue los protocolos vigentes de higiene, manipulación y bioseguridad del mercado.</li></ul></article>
      </div>
      <p className="product-disclaimer">La tabla es demostrativa y no constituye una cotización oficial en tiempo real.</p>
    </section>

    <section className="section market-events-section" aria-labelledby="market-events-heading">
      <div className="section-heading"><div><p className="eyebrow">SOLO AGRICULTURA Y PRODUCTORES</p><h2 id="market-events-heading">Eventos para agricultores</h2></div></div>
      <div className="event-filters">
        <label>Buscar<input type="search" value={eventSearch} onChange={(event) => setEventSearch(event.target.value)} placeholder="Productos, productores..." /></label>
        <label>Categoría<select value={eventCategory} onChange={(event) => setEventCategory(event.target.value)}><option>Todas</option>{[...new Set(events.map((item) => item.category))].map((category) => <option key={category}>{category}</option>)}</select></label>
        <label>Desde<input type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} /></label>
      </div>
      <div className="event-grid">
        {filteredEvents.map((event) => <article className="market-event-card" key={event.title}>
          <img src={event.image} alt="" loading="lazy" /><div><span className="event-category">{event.category}</span><h3>{event.title}</h3><p><strong>{new Date(`${event.date}T12:00:00`).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> · {event.place}</p></div>
        </article>)}
        {filteredEvents.length === 0 && <p className="empty">No hay eventos agrícolas que coincidan con esos filtros.</p>}
      </div>
    </section>

    <section className="section">
      <div className="section-heading"><div><p className="eyebrow">ATENCIÓN INTEGRADA</p><h2>Servicios del comerciante</h2></div></div>
      <div className="portal-services">
        {canAccessPnp && <Link className="portal-service" to="/pnp"><span>02 · PNP</span><strong>Reportar un incidente</strong><small>Registrar y hacer seguimiento de denuncias asociadas al puesto.</small></Link>}
        {canAccessEssalud && <Link className="portal-service" to="/essalud"><span>03 · ESSALUD</span><strong>Atención de salud</strong><small>Solicitar citas y revisar derivaciones vinculadas a incidentes.</small></Link>}
      </div>
    </section>
  </>;
}

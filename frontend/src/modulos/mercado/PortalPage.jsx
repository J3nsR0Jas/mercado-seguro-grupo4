import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, jsonBody } from '../../api/client.js';
import { Feedback, Status } from '../../components/Feedback.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const mapUrl = 'https://maps.google.com/maps?q=Mercado%20Mayorista%20de%20Lima%2C%20Santa%20Anita%2C%20Lima%2C%20Per%C3%BA&output=embed';
const directionsUrl = 'https://www.google.com/maps/search/?api=1&query=Mercado+Mayorista+de+Lima%2C+Santa+Anita%2C+Lima%2C+Peru';
const categories = [
  { id: 'tuberculos', label: 'Tubérculos', color: 'tubercles' },
  { id: 'frutas', label: 'Frutas', color: 'fruits' },
  { id: 'verduras', label: 'Verduras', color: 'vegetables' }
];
const productImageFallback = '/images/producto-agricola-fallback.svg';
const handleProductImageError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = productImageFallback;
};
const products = [
  { id: 'papa-amarilla', name: 'Papa amarilla', category: 'tuberculos', price: 4.2, wholesale: 115, package: 'saco', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=85', offer: { previous: 4.8, price: 3.9 } },
  { id: 'papa-blanca', name: 'Papa blanca', category: 'tuberculos', price: 2.6, wholesale: 72, package: 'saco', image: 'https://images.unsplash.com/photo-1675501344642-92d35d90fe51?auto=format&fit=crop&w=800&q=85' },
  { id: 'papa-canchan', name: 'Papa Canchan', category: 'tuberculos', price: 3.2, wholesale: 86, package: 'saco', image: 'https://images.unsplash.com/photo-1563012678-bdfec255931b?auto=format&fit=crop&w=800&q=85' },
  { id: 'camote', name: 'Camote', category: 'tuberculos', price: 2.9, wholesale: 78, package: 'saco', image: 'https://images.unsplash.com/photo-1730815048561-45df6f7f331d?auto=format&fit=crop&w=800&q=85' },
  { id: 'yuca', name: 'Yuca', category: 'tuberculos', price: 3.1, wholesale: 82, package: 'saco', image: '/images/yuca.webp' },
  { id: 'olluco', name: 'Olluco', category: 'tuberculos', price: 3.8, wholesale: 101, package: 'saco', image: 'https://images.unsplash.com/photo-1635774855536-9728f2610245?auto=format&fit=crop&w=800&q=85' },
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
const priceProducts = [
  { id: 'papa-yungay', name: 'Papa Yungay', image: products.find((product) => product.id === 'papa-amarilla').image, varieties: [
    { name: 'Yungay primera', min: 1.8, max: 2.4, average: 2.1, volumeMin: 120, volumeMax: 185, volumeAverage: 152.5 },
    { name: 'Yungay comercial', min: 1.5, max: 2, average: 1.75, volumeMin: 90, volumeMax: 140, volumeAverage: 115 }
  ] },
  { id: 'papa-canchan', name: 'Papa Canchan', image: products.find((product) => product.id === 'papa-canchan').image, varieties: [
    { name: 'Canchan primera', min: 1.7, max: 2.3, average: 2, volumeMin: 85, volumeMax: 125, volumeAverage: 105 },
    { name: 'Canchan comercial', min: 1.4, max: 1.9, average: 1.65, volumeMin: 70, volumeMax: 110, volumeAverage: 90 }
  ] },
  { id: 'camote-morado', name: 'Camote Morado', image: products.find((product) => product.id === 'camote').image, varieties: [
    { name: 'Morado extra', min: 1.8, max: 2.5, average: 2.15, volumeMin: 35, volumeMax: 58, volumeAverage: 46.5 },
    { name: 'Morado estándar', min: 1.4, max: 2, average: 1.7, volumeMin: 28, volumeMax: 45, volumeAverage: 36.5 }
  ] },
  { id: 'yuca-blanca', name: 'Yuca Blanca', image: products.find((product) => product.id === 'yuca').image, varieties: [
    { name: 'Blanca primera', min: 1.9, max: 2.6, average: 2.25, volumeMin: 42, volumeMax: 68, volumeAverage: 55 },
    { name: 'Blanca comercial', min: 1.5, max: 2.1, average: 1.8, volumeMin: 30, volumeMax: 51, volumeAverage: 40.5 }
  ] },
  { id: 'cebolla-roja', name: 'Cebolla Roja', image: products.find((product) => product.id === 'cebolla').image, varieties: [
    { name: 'Roja primera', min: 2.2, max: 3.1, average: 2.65, volumeMin: 75, volumeMax: 112, volumeAverage: 93.5 },
    { name: 'Roja comercial', min: 1.8, max: 2.5, average: 2.15, volumeMin: 55, volumeMax: 88, volumeAverage: 71.5 }
  ] },
  { id: 'tomate', name: 'Tomate', image: products.find((product) => product.id === 'tomate').image, varieties: [
    { name: 'Italiano', min: 2.4, max: 3.6, average: 3, volumeMin: 65, volumeMax: 98, volumeAverage: 81.5 },
    { name: 'Katya', min: 2, max: 3, average: 2.5, volumeMin: 48, volumeMax: 76, volumeAverage: 62 }
  ] },
  { id: 'zanahoria', name: 'Zanahoria', image: products.find((product) => product.id === 'zanahoria').image, varieties: [
    { name: 'Chantenay', min: 1.5, max: 2.2, average: 1.85, volumeMin: 50, volumeMax: 82, volumeAverage: 66 },
    { name: 'Royal', min: 1.3, max: 1.9, average: 1.6, volumeMin: 38, volumeMax: 65, volumeAverage: 51.5 }
  ] },
  { id: 'limon', name: 'Limón', image: productImageFallback, varieties: [
    { name: 'Sutil primera', min: 2.8, max: 4.2, average: 3.5, volumeMin: 90, volumeMax: 135, volumeAverage: 112.5 },
    { name: 'Sutil comercial', min: 2.2, max: 3.4, average: 2.8, volumeMin: 68, volumeMax: 104, volumeAverage: 86 }
  ] }
];
const events = [
  { title: 'Feria de productores y cosecha de temporada', category: 'Feria agropecuaria', date: '2026-12-05', place: 'Santa Anita', image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=85' },
  { title: 'Rueda de negocio con agricultores locales', category: 'Rueda de negocio', date: '2026-12-12', place: 'Pabellón de productores', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=85' },
  { title: 'Capacitación de poscosecha y conservación', category: 'Capacitación agrícola', date: '2027-01-09', place: 'Aula de capacitación', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=85' },
  { title: 'Festival de cosecha y semillas nativas', category: 'Festival de cosecha', date: '2027-01-23', place: 'Plaza de productores', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=85' }
];
const categoryLabel = (category) => categories.find((item) => item.id === category)?.label ?? category;
const money = (amount) => `S/ ${amount.toFixed(2)}`;
const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const marketSlides = [
  { image: '/images/mercado-hero.jpg', alt: 'Vista del Mercado Mayorista de Lima' },
  { image: '/images/mercado-pabellon.jpg', alt: 'Pabellones de venta del mercado' },
  { image: '/images/mercado-camiones.jpg', alt: 'Camiones abasteciendo el mercado' },
  { image: '/images/mercado-balanza.jpg', alt: 'Control de peso de productos frescos' }
];

export default function MercadoPortalPage() {
  const { user } = useAuth();
  const [stalls, setStalls] = useState([]);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('tuberculos');
  const [wholesaleMode, setWholesaleMode] = useState(false);
  const [cart, setCart] = useState({});
  const [orderMessage, setOrderMessage] = useState('');
  const [orderError, setOrderError] = useState('');
  const [orderBusy, setOrderBusy] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [savedOrder, setSavedOrder] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersError, setOrdersError] = useState('');
  const [eventCategory, setEventCategory] = useState('Todas');
  const [eventDate, setEventDate] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [activeMarketSlide, setActiveMarketSlide] = useState(0);
  const [priceDate, setPriceDate] = useState(today);
  const [queriedPriceDate, setQueriedPriceDate] = useState(today);
  const [priceVariable, setPriceVariable] = useState('price');
  const [priceSearch, setPriceSearch] = useState('');
  const [selectedPriceProductIds, setSelectedPriceProductIds] = useState(() => priceProducts.map((product) => product.id));
  const [priceQueryMessage, setPriceQueryMessage] = useState('');
  const role = user?.roles.find((item) => item.modulo === 'mercado')?.rol;
  const hasAccess = Boolean(role);
  const canViewOrders = Boolean(user?.roles.some((item) => item.modulo === 'mercado' && ['empleado', 'administrador'].includes(item.rol)));
  const canAccessPnp = user?.roles.some((item) => item.modulo === 'pnp');
  const canAccessEssalud = user?.roles.some((item) => item.modulo === 'essalud');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => {
      setActiveMarketSlide((current) => (current + 1) % marketSlides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setStalls([]);
    setError('');
    if (!hasAccess) return;
    api('/mercado/comerciantes')
      .then(({ puestos }) => setStalls(puestos))
      .catch((requestError) => setError(requestError.message));
  }, [user, hasAccess]);

  useEffect(() => {
    if (!canViewOrders) return undefined;
    let active = true;
    api('/mercado/pedidos-mayoristas')
      .then(({ pedidos }) => { if (active) setRecentOrders(pedidos); })
      .catch((requestError) => { if (active) setOrdersError(requestError.message); });
    return () => { active = false; };
  }, [canViewOrders, savedOrder?.id]);

  const actionPath = role === 'administrador' ? '/mercado/seguridad'
    : role === 'empleado' ? '/mercado/registros'
      : '/mercado/mi-puesto';
  const visibleProducts = products.filter((product) => product.category === activeCategory);
  const offerProducts = products.filter((product) => product.offer);
  const filteredPriceProducts = priceProducts.filter((product) => product.name.toLowerCase().includes(priceSearch.toLowerCase()));
  const selectedPriceProducts = priceProducts.filter((product) => selectedPriceProductIds.includes(product.id));
  const selectedPriceRows = selectedPriceProducts.flatMap((product) => product.varieties.map((variety) => ({ product, variety })));
  const averagePrice = selectedPriceRows.length
    ? selectedPriceRows.reduce((total, { variety }) => total + variety.average, 0) / selectedPriceRows.length
    : 0;
  const minPrice = selectedPriceRows.length ? Math.min(...selectedPriceRows.map(({ variety }) => variety.min)) : 0;
  const maxPrice = selectedPriceRows.length ? Math.max(...selectedPriceRows.map(({ variety }) => variety.max)) : 0;
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
      const minimum = wholesaleMode && product.category !== 'frutas' ? 8 : 1;
      return { ...current, [product.id]: Math.max(minimum, (current[product.id] ?? 0) + 1) };
    });
  }

  function updateQuantity(product, change) {
    setOrderMessage('');
    setCart((current) => {
      const minimum = wholesaleMode && product.category !== 'frutas' ? 8 : 1;
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
      return [id, product && product.category !== 'frutas' ? Math.max(8, quantity) : Math.max(1, quantity)];
    })));
  }

  function togglePriceProduct(productId) {
    setSelectedPriceProductIds((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
  }

  function toggleAllPriceProducts() {
    setSelectedPriceProductIds((current) => current.length === priceProducts.length
      ? []
      : priceProducts.map((product) => product.id));
  }

  function changeMarketSlide(direction) {
    setActiveMarketSlide((current) => (current + direction + marketSlides.length) % marketSlides.length);
  }

  function consultPrices() {
    if (!priceDate) {
      setPriceQueryMessage('Selecciona una fecha para realizar la consulta.');
      return;
    }
    setQueriedPriceDate(priceDate);
    const dateLabel = new Date(`${priceDate}T12:00:00`).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
    setPriceQueryMessage(`Consulta referencial aplicada para el ${dateLabel}.`);
  }

  async function confirmOrder(event) {
    event.preventDefault();
    setOrderError('');
    setOrderMessage('');
    const invalid = cartItems.some(({ product, quantity }) => wholesaleMode
      ? product.category === 'frutas' ? quantity < 1 : quantity < 8
      : quantity < 1);
    if (invalid || cartItems.length === 0) {
      setOrderMessage('Revisa las cantidades mínimas y agrega productos antes de confirmar.');
      return;
    }
    if (!buyerName.trim()) {
      setOrderMessage('Ingresa el nombre de quien realiza el pedido.');
      return;
    }

    setOrderBusy(true);
    try {
      const { pedido } = await api('/mercado/pedidos-mayoristas', {
        method: 'POST',
        body: jsonBody({
          cliente_nombre: buyerName.trim(),
          telefono: buyerPhone.trim(),
          tipo_compra: wholesaleMode ? 'proveedor' : 'minorista',
          detalle_items: cartItems.map(({ product, quantity }) => ({ id: product.id, cantidad: quantity }))
        })
      });
      setSavedOrder(pedido);
      setOrderMessage(`Pedido #${pedido.id} guardado en la base de datos. Total confirmado: ${money(Number(pedido.total))}.`);
      setCart({});
      setBuyerName('');
      setBuyerPhone('');
    } catch (requestError) {
      setOrderError(requestError.message);
    } finally {
      setOrderBusy(false);
    }
  }

  return <>
    <section className="portal-hero market-portal">
      <div className="market-carousel-images" aria-live="polite">
        {marketSlides.map((slide, index) => <img
          className={`market-carousel-image${activeMarketSlide === index ? ' active' : ''}`}
          key={slide.image}
          src={slide.image}
          alt={slide.alt}
          aria-hidden={activeMarketSlide !== index}
        />)}
      </div>
      <div className="portal-hero-content market-carousel-content">
        <p className="portal-kicker"><span className="market-emblem" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path fill="currentColor" d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg></span> EMPRESA MUNICIPAL DE MERCADOS · SANTA ANITA</p>
        <h1>Gran Mercado Mayorista de Lima - Atención al Comerciante y Precios Diarios</h1>
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
      <div className="market-carousel-controls">
        <button className="market-carousel-arrow" type="button" aria-label="Imagen anterior" onClick={() => changeMarketSlide(-1)}>‹</button>
        <div className="market-carousel-indicators" role="group" aria-label="Seleccionar imagen del mercado">
          {marketSlides.map((slide, index) => <button
            className={`market-carousel-indicator${activeMarketSlide === index ? ' active' : ''}`}
            key={slide.image}
            type="button"
            aria-label={`Mostrar imagen ${index + 1}: ${slide.alt}`}
            aria-current={activeMarketSlide === index ? 'true' : undefined}
            onClick={() => setActiveMarketSlide(index)}
          />)}
        </div>
        <button className="market-carousel-arrow" type="button" aria-label="Imagen siguiente" onClick={() => changeMarketSlide(1)}>›</button>
      </div>
    </section>

    <Feedback error={error} />

    <section className="section market-prices-section" aria-labelledby="market-prices-heading">
      <header className="market-prices-header">
        <div><p className="eyebrow">INFORMACIÓN PARA EL COMERCIANTE</p><h2 id="market-prices-heading">Precios Mayoristas — Consulta diaria de precios por producto y variedad</h2></div>
        <button className="button market-prices-submit" type="button" onClick={consultPrices}>Consultar precios</button>
      </header>
      <div className="market-prices-layout">
        <aside className="market-price-filters" aria-labelledby="market-price-filters-heading">
          <h3 id="market-price-filters-heading">Filtros de consulta</h3>
          <label>Fecha de consulta<input type="date" value={priceDate} onChange={(event) => setPriceDate(event.target.value)} /></label>
          <div className="market-price-variable" role="group" aria-label="Variable de consulta">
            <button className={priceVariable === 'price' ? 'selected' : ''} type="button" aria-pressed={priceVariable === 'price'} onClick={() => setPriceVariable('price')}>Precio (S/)</button>
            <button className={priceVariable === 'volume' ? 'selected' : ''} type="button" aria-pressed={priceVariable === 'volume'} onClick={() => setPriceVariable('volume')}>Volumen (Toneladas)</button>
          </div>
          <label>Buscar producto<input type="search" value={priceSearch} onChange={(event) => setPriceSearch(event.target.value)} placeholder="Escribe un producto..." /></label>
          <label className="market-select-all">
            <input type="checkbox" checked={selectedPriceProductIds.length === priceProducts.length} onChange={toggleAllPriceProducts} />
            <span>Seleccionar todos</span>
          </label>
          <div className="market-price-product-list">
            {filteredPriceProducts.map((product) => <label className="market-price-product" key={product.id}>
              <input type="checkbox" checked={selectedPriceProductIds.includes(product.id)} onChange={() => togglePriceProduct(product.id)} />
              <img src={product.image} alt="" loading="lazy" onError={handleProductImageError} />
              <span>{product.name}</span>
            </label>)}
            {filteredPriceProducts.length === 0 && <p className="hint">No se encontraron productos.</p>}
          </div>
        </aside>
        <div className="market-price-results">
          <div className="market-price-kpis">
            <article><span>Productos seleccionados</span><strong>{selectedPriceProducts.length}</strong></article>
            <article><span>Variedades analizadas</span><strong>{selectedPriceRows.length}</strong></article>
            <article><span>Precio promedio general (S/)</span><strong>{selectedPriceRows.length ? averagePrice.toFixed(2) : '—'}</strong></article>
            <article><span>Rango de precios (S/ mín - S/ máx)</span><strong>{selectedPriceRows.length ? `${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}` : '—'}</strong></article>
          </div>
          <div className="market-price-table-heading"><h3>Resultados de la consulta</h3><span>Fecha: {new Date(`${queriedPriceDate}T12:00:00`).toLocaleDateString('es-PE')}</span></div>
          <div className="table-wrap market-price-table-wrap">
            <table>
              <thead><tr>
                <th>N°</th><th>Producto</th><th>Variedad</th>
                {priceVariable === 'price'
                  ? <><th>Precio mín. (S/)</th><th>Precio máx. (S/)</th><th>Precio prom. (S/)</th></>
                  : <><th>Volumen mín. (TM)</th><th>Volumen máx. (TM)</th><th>Volumen prom. (TM)</th></>}
              </tr></thead>
              <tbody>
                {selectedPriceRows.map(({ product, variety }, index) => <tr key={`${product.id}-${variety.name}`}>
                  <td>{index + 1}</td><td>{product.name}</td><td>{variety.name}</td>
                  {priceVariable === 'price'
                    ? <><td>{variety.min.toFixed(2)}</td><td>{variety.max.toFixed(2)}</td><td>{variety.average.toFixed(2)}</td></>
                    : <><td>{variety.volumeMin.toFixed(2)}</td><td>{variety.volumeMax.toFixed(2)}</td><td>{variety.volumeAverage.toFixed(2)}</td></>}
                </tr>)}
                {selectedPriceRows.length === 0 && <tr><td colSpan="6">Selecciona al menos un producto para consultar sus resultados.</td></tr>}
              </tbody>
            </table>
          </div>
          <p className="market-price-disclaimer">Precios y volúmenes referenciales de demostración; no son cotizaciones oficiales ni datos históricos en tiempo real.</p>
          {priceQueryMessage && <p className="market-price-status" role="status">{priceQueryMessage}</p>}
        </div>
      </div>
    </section>

    <section className="portal-grid section" id="market-tramites">
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
          <img src={product.image} alt={product.name} loading="lazy" onError={handleProductImageError} />
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
          <img src={product.image} alt="" loading="lazy" onError={handleProductImageError} />
          <div><span className="offer-badge">PRECIO PROMOCIONAL</span><h3>{product.name}</h3><span><del>{money(product.offer.previous)} / kg</del> <strong>{money(product.offer.price)} / kg</strong></span></div>
          <button className="button button-secondary" type="button" onClick={() => { setActiveCategory(product.category); addToCart(product); }}>Agregar oferta</button>
        </article>)}
      </div>
    </section>

    <section className="section online-market-section" aria-labelledby="market-cart-heading">
      <div className="section-heading"><div><p className="eyebrow">COMPRA EN LÍNEA · PEDIDO REGISTRADO EN POSTGRESQL</p><h2 id="market-cart-heading">Tu carrito mayorista</h2></div></div>
      <div className="order-mode-switch" role="group" aria-label="Tipo de pedido">
        <button className={`category-tab ${!wholesaleMode ? 'selected' : ''}`} type="button" aria-pressed={!wholesaleMode} onClick={() => { setWholesaleMode(false); setOrderMessage(''); }}>Compra por kilo</button>
        <button className={`category-tab ${wholesaleMode ? 'selected' : ''}`} type="button" aria-pressed={wholesaleMode} onClick={enableWholesaleMode}>Pedido para proveedor</button>
      </div>
      {wholesaleMode && <div className="wholesale-rule"><strong>Reglas de pedido al por mayor:</strong> tubérculos y verduras, mínimo 8 sacos por producto; frutas, mínimo 1 caja. Puedes ajustar cantidades antes de confirmar.</div>}
      {cartItems.length === 0
        ? <p className="empty">Tu carrito está vacío. Agrega productos desde el catálogo.</p>
        : <div className="cart-panel">
          {cartItems.map(({ product, quantity }) => {
            const unit = wholesaleMode ? product.package : 'kg';
            const unitPrice = wholesaleMode ? product.wholesale : (product.offer?.price ?? product.price);
            const minimum = wholesaleMode && product.category !== 'frutas' ? 8 : 1;
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
          <form className="cart-checkout-form" onSubmit={confirmOrder}>
            <label>Nombre del cliente<input value={buyerName} onChange={(event) => setBuyerName(event.target.value)} required maxLength="150" autoComplete="name" /></label>
            <label>Teléfono de contacto (opcional)<input type="tel" value={buyerPhone} onChange={(event) => setBuyerPhone(event.target.value)} maxLength="30" autoComplete="tel" /></label>
            <button className="button button-primary" type="submit" disabled={orderBusy}>{orderBusy ? 'Guardando pedido…' : 'Validar y guardar pedido'}</button>
          </form>
        </div>}
      <Feedback error={orderError} />
      {orderMessage && <p className="feedback" role="status">{orderMessage}</p>}
      {canViewOrders && <div className="recent-market-orders">
        <h3>Últimos pedidos mayoristas</h3>
        <Feedback error={ordersError} />
        {recentOrders.length
          ? <div className="table-wrap"><table><thead><tr><th>Pedido</th><th>Cliente</th><th>Tipo</th><th>Total</th><th>Estado</th></tr></thead><tbody>
            {recentOrders.slice(0, 10).map((order) => <tr key={order.id}><td>#{order.id}</td><td>{order.cliente_nombre}</td><td>{order.tipo_compra}</td><td>{money(Number(order.total))}</td><td>{order.estado}</td></tr>)}
          </tbody></table></div>
          : !ordersError && <p className="hint">Aún no hay pedidos registrados.</p>}
      </div>}
      <p className="hint">El importe se recalcula y el pedido se guarda en PostgreSQL. El registro no procesa pagos; coordina el pago con el proveedor.</p>
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
          <img src={event.image} alt="" loading="lazy" onError={handleProductImageError} /><div><span className="event-category">{event.category}</span><h3>{event.title}</h3><p><strong>{new Date(`${event.date}T12:00:00`).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> · {event.place}</p></div>
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

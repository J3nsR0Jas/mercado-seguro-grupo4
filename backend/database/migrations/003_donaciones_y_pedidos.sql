CREATE TABLE IF NOT EXISTS donantes_sangre (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    dni VARCHAR(20),
    grupo_sanguineo VARCHAR(10) NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    fecha_preferida VARCHAR(40),
    observaciones TEXT,
    creado_en TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_donantes_sangre_creado_en
    ON donantes_sangre(creado_en DESC);

CREATE TABLE IF NOT EXISTS pedidos_mayoristas (
    id SERIAL PRIMARY KEY,
    cliente_nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(30),
    tipo_compra VARCHAR(30) NOT NULL,
    detalle_items JSONB NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    estado VARCHAR(30) DEFAULT 'registrado',
    creado_en TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pedidos_mayoristas_creado_en
    ON pedidos_mayoristas(creado_en DESC);

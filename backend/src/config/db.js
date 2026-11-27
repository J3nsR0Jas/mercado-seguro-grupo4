import pg from 'pg';
import { readFile } from 'node:fs/promises';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL es obligatorio para conectar con PostgreSQL.');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000
});

export async function initializeFeatureTables() {
  const migration = new URL('../../database/migrations/003_donaciones_y_pedidos.sql', import.meta.url);
  const schema = await readFile(migration, 'utf8');
  await pool.query(schema);
}

pool.on('error', (error) => {
  console.error('Error inesperado en el pool de PostgreSQL:', error);
});

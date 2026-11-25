import { pbkdf2, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const derive = promisify(pbkdf2);
const ITERATIONS = 310_000;
const KEY_LENGTH = 32;

export async function hashPassword(password) {
  const salt = randomBytes(24);
  const digest = await derive(password, salt, ITERATIONS, KEY_LENGTH, 'sha256');
  return `pbkdf2_sha256$${ITERATIONS}$${salt.toString('base64')}$${digest.toString('base64')}`;
}

export async function verifyPassword(password, encoded) {
  const [algorithm, iterationsText, saltText, digestText] = encoded.split('$');
  const iterations = Number(iterationsText);
  if (algorithm !== 'pbkdf2_sha256' || !Number.isInteger(iterations) || iterations < 100_000 || iterations > 1_000_000) {
    throw new Error('El hash de contraseña almacenado no tiene un formato permitido.');
  }

  const expected = Buffer.from(digestText, 'base64');
  const actual = await derive(password, Buffer.from(saltText, 'base64'), iterations, expected.length, 'sha256');
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

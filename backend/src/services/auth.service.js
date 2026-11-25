import * as authRepository from '../repositories/auth.repository.js';
import { createToken } from '../middlewares/auth.js';
import { hashPassword, verifyPassword } from '../utils/passwords.js';

export async function login({ correo, contrasena }) {
  const user = await authRepository.findUserByEmail(correo.toLowerCase());
  if (!user || !(await verifyPassword(contrasena, user.contrasena_hash))) {
    const error = new Error('Correo o contraseña incorrectos.');
    error.status = 401;
    throw error;
  }
  const safeUser = { id: user.id, nombre: user.nombre, correo: user.correo, roles: await authRepository.listRoles(user.id) };
  return { token: createToken(safeUser), usuario: safeUser };
}

export async function register({ nombre, correo, contrasena }) {
  if (nombre.length < 3 || nombre.length > 120) {
    const error = new Error('El nombre debe tener entre 3 y 120 caracteres.');
    error.status = 400;
    throw error;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) || contrasena.length < 10) {
    const error = new Error('Ingresa un correo válido y una contraseña de al menos 10 caracteres.');
    error.status = 400;
    throw error;
  }
  const user = await authRepository.insertUser({
    nombre,
    correo: correo.toLowerCase(),
    contrasenaHash: await hashPassword(contrasena)
  });
  return login({ correo, contrasena });
}

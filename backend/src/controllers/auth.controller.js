import * as authService from '../services/auth.service.js';

export async function login(req, res, next) {
  try {
    const { correo, contrasena } = req.body;
    if (typeof correo !== 'string' || typeof contrasena !== 'string') {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
    }
    res.json(await authService.login({ correo: correo.trim(), contrasena }));
  } catch (error) {
    next(error);
  }
}

export async function register(req, res, next) {
  try {
    const body = req.body ?? {};
    if (['rol', 'role', 'roles', 'modulo', 'module'].some((field) => Object.hasOwn(body, field))) {
      return res.status(400).json({ error: 'Los roles y módulos se asignan automáticamente; no se pueden elegir en el registro.' });
    }
    const { nombre, correo, contrasena } = body;
    if (![nombre, correo, contrasena].every((value) => typeof value === 'string')) {
      return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios.' });
    }
    const result = await authService.register({
      nombre: nombre.trim(),
      correo: correo.trim(),
      contrasena
    });
    res.status(201).json(result);
  } catch (error) {
    if (error.code === '23505') {
      error.status = 409;
      error.message = 'Ese correo ya tiene una cuenta.';
    }
    next(error);
  }
}

export function me(req, res) {
  res.json({ usuario: { id: req.user.sub, nombre: req.user.name, roles: req.user.roles } });
}

import jwt from 'jsonwebtoken';

const secret = () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET debe tener al menos 32 caracteres.');
  }
  return process.env.JWT_SECRET;
};

export function createToken(user) {
  return jwt.sign(
    { name: user.nombre, roles: user.roles },
    secret(),
    { subject: String(user.id), expiresIn: '8h', issuer: 'mercado-seguro' }
  );
}

export function authenticate(req, res, next) {
  const authorization = req.get('authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Inicia sesión para continuar.' });
  }

  try {
    req.user = jwt.verify(authorization.slice(7), secret(), { issuer: 'mercado-seguro' });
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'La sesión expiró o no es válida. Inicia sesión nuevamente.' });
    }
    next(error);
  }
}

export function requireModuleRole(module, ...roles) {
  return (req, res, next) => {
    const allowed = req.user?.roles?.some((entry) => entry.modulo === module && roles.includes(entry.rol));
    if (!allowed) return res.status(403).json({ error: `No tienes un rol autorizado en ${module}.` });
    next();
  };
}

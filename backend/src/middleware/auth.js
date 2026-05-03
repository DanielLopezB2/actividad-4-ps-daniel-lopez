const jwt = require('jsonwebtoken');
const User = require('../models/User');

const proteger = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Token requerido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = User.findById(decoded.id);

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Token inválido: usuario no encontrado.' });
    }

    req.usuario = usuario;
    next();
  } catch {
    res.status(401).json({ mensaje: 'Token inválido o expirado.' });
  }
};

module.exports = { proteger };

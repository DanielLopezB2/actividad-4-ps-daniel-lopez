const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generarToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, correo, password]
 *             properties:
 *               nombre: { type: string, example: "María García" }
 *               correo: { type: string, example: "maria@universidad.edu.co" }
 *               password: { type: string, example: "segura123" }
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: El correo ya está registrado
 */
const register = (req, res) => {
  const { nombre, correo, password } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({ mensaje: 'Nombre, correo y contraseña son obligatorios.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  try {
    const usuario = User.create({ nombre, correo, password });
    const token = generarToken(usuario.id);
    res.status(201).json({ token, usuario });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }
    throw err;
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [correo, password]
 *             properties:
 *               correo: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login exitoso, retorna JWT
 *       401:
 *         description: Credenciales inválidas
 */
const login = (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios.' });
  }

  const usuario = User.findByCorreo(correo);
  if (!usuario || !User.verificarPassword(password, usuario.password)) {
    return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
  }

  const { password: _, ...usuarioSinPass } = usuario;
  const token = generarToken(usuario.id);
  res.json({ token, usuario: usuarioSinPass });
};

/**
 * @swagger
 * /api/auth/perfil:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 *       401:
 *         description: No autorizado
 */
const perfil = (req, res) => {
  res.json({ usuario: req.usuario });
};

module.exports = { register, login, perfil };

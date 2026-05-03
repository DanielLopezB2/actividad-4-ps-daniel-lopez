const Habit = require('../models/Habit');

/**
 * @swagger
 * /api/habits:
 *   get:
 *     summary: Listar todos los hábitos del usuario
 *     tags: [Hábitos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de hábitos del usuario autenticado
 */
const listar = (req, res) => {
  const habitos = Habit.findAllByUser(req.usuario.id);
  res.json({ habitos });
};

/**
 * @swagger
 * /api/habits:
 *   post:
 *     summary: Crear un nuevo hábito
 *     tags: [Hábitos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, categoria]
 *             properties:
 *               nombre: { type: string, example: "Meditar 10 minutos" }
 *               descripcion: { type: string }
 *               categoria: { type: string, enum: [salud, estudio, ejercicio, bienestar, otro] }
 *               frecuencia: { type: string, enum: [diario, semanal] }
 *               hora_recordatorio: { type: string, example: "07:00" }
 *     responses:
 *       201:
 *         description: Hábito creado
 */
const crear = (req, res) => {
  const { nombre, descripcion, categoria, frecuencia, hora_recordatorio } = req.body;

  if (!nombre || !categoria) {
    return res.status(400).json({ mensaje: 'Nombre y categoría son obligatorios.' });
  }

  try {
    const habito = Habit.create({
      usuario_id: req.usuario.id,
      nombre,
      descripcion,
      categoria,
      frecuencia,
      hora_recordatorio,
    });
    res.status(201).json({ habito });
  } catch (err) {
    if (err.message.includes('CHECK')) {
      return res.status(400).json({ mensaje: 'Categoría o frecuencia inválida.' });
    }
    throw err;
  }
};

/**
 * @swagger
 * /api/habits/{id}:
 *   put:
 *     summary: Actualizar un hábito
 *     tags: [Hábitos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Hábito actualizado
 *       403:
 *         description: Sin autorización para este recurso
 *       404:
 *         description: Hábito no encontrado
 */
const actualizar = (req, res) => {
  const habito = Habit.findById(req.params.id);

  if (!habito) return res.status(404).json({ mensaje: 'Hábito no encontrado.' });
  if (habito.usuario_id !== req.usuario.id) {
    return res.status(403).json({ mensaje: 'No tenés permiso para modificar este hábito.' });
  }

  const actualizado = Habit.update(req.params.id, req.body);
  res.json({ habito: actualizado });
};

/**
 * @swagger
 * /api/habits/{id}:
 *   delete:
 *     summary: Eliminar un hábito (soft delete)
 *     tags: [Hábitos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Hábito eliminado
 */
const eliminar = (req, res) => {
  const habito = Habit.findById(req.params.id);

  if (!habito) return res.status(404).json({ mensaje: 'Hábito no encontrado.' });
  if (habito.usuario_id !== req.usuario.id) {
    return res.status(403).json({ mensaje: 'No tenés permiso para eliminar este hábito.' });
  }

  Habit.softDelete(req.params.id);
  res.json({ mensaje: 'Hábito eliminado correctamente.' });
};

module.exports = { listar, crear, actualizar, eliminar };

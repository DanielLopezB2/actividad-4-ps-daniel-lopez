const db = require('../config/database');

const Habit = {
  findAllByUser(usuario_id) {
    return db
      .prepare('SELECT * FROM habits WHERE usuario_id = ? AND activo = 1 ORDER BY created_at DESC')
      .all(usuario_id);
  },

  findById(id) {
    return db.prepare('SELECT * FROM habits WHERE id = ?').get(id);
  },

  create({ usuario_id, nombre, descripcion, categoria, frecuencia, hora_recordatorio }) {
    const result = db
      .prepare(
        `INSERT INTO habits (usuario_id, nombre, descripcion, categoria, frecuencia, hora_recordatorio)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(usuario_id, nombre, descripcion || '', categoria, frecuencia || 'diario', hora_recordatorio || null);
    return this.findById(result.lastInsertRowid);
  },

  update(id, campos) {
    const allowed = ['nombre', 'descripcion', 'categoria', 'frecuencia', 'hora_recordatorio'];
    const sets = allowed
      .filter((k) => campos[k] !== undefined)
      .map((k) => `${k} = ?`);
    const values = allowed.filter((k) => campos[k] !== undefined).map((k) => campos[k]);

    if (sets.length === 0) return this.findById(id);

    sets.push(`updated_at = datetime('now')`);
    db.prepare(`UPDATE habits SET ${sets.join(', ')} WHERE id = ?`).run(...values, id);
    return this.findById(id);
  },

  softDelete(id) {
    db.prepare(`UPDATE habits SET activo = 0, updated_at = datetime('now') WHERE id = ?`).run(id);
  },
};

module.exports = Habit;

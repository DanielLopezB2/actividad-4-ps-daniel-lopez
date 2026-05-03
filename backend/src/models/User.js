const bcrypt = require('bcryptjs');
const db = require('../config/database');

const User = {
  findByCorreo(correo) {
    return db.prepare('SELECT * FROM users WHERE correo = ?').get(correo);
  },

  findById(id) {
    return db.prepare('SELECT id, nombre, correo, created_at FROM users WHERE id = ?').get(id);
  },

  create({ nombre, correo, password }) {
    const hash = bcrypt.hashSync(password, 10);
    const result = db
      .prepare('INSERT INTO users (nombre, correo, password) VALUES (?, ?, ?)')
      .run(nombre, correo.toLowerCase().trim(), hash);
    return this.findById(result.lastInsertRowid);
  },

  verificarPassword(candidato, hash) {
    return bcrypt.compareSync(candidato, hash);
  },
};

module.exports = User;

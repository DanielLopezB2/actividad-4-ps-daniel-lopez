const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../habitflow.db');

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre    TEXT    NOT NULL,
    correo    TEXT    NOT NULL UNIQUE,
    password  TEXT    NOT NULL,
    created_at TEXT   DEFAULT (datetime('now')),
    updated_at TEXT   DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS habits (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id        INTEGER NOT NULL REFERENCES users(id),
    nombre            TEXT    NOT NULL,
    descripcion       TEXT    DEFAULT '',
    categoria         TEXT    NOT NULL CHECK(categoria IN ('salud','estudio','ejercicio','bienestar','otro')),
    frecuencia        TEXT    NOT NULL DEFAULT 'diario' CHECK(frecuencia IN ('diario','semanal')),
    hora_recordatorio TEXT,
    activo            INTEGER NOT NULL DEFAULT 1,
    created_at        TEXT    DEFAULT (datetime('now')),
    updated_at        TEXT    DEFAULT (datetime('now'))
  );
`);

console.log(`SQLite conectado: ${DB_PATH}`);

module.exports = db;

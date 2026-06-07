const bcrypt = require('bcryptjs');

// Usar DB en memoria (NODE_ENV=test lo activa en database.js)
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

const db = require('../../config/database');
const User = require('../User');

beforeEach(() => {
  db.exec('DELETE FROM habits');
  db.exec('DELETE FROM users');
});

afterAll(() => {
  db.close();
});

describe('User.create()', () => {
  test('crea un usuario y retorna su id y nombre', () => {
    const u = User.create({ nombre: 'Ana', correo: 'ana@test.com', password: 'secret123' });
    expect(u.id).toBeDefined();
    expect(u.nombre).toBe('Ana');
  });

  test('hashea la contraseña con bcrypt', () => {
    User.create({ nombre: 'Bob', correo: 'bob@test.com', password: 'mipassword' });
    const raw = db.prepare('SELECT password FROM users WHERE correo = ?').get('bob@test.com');
    expect(bcrypt.compareSync('mipassword', raw.password)).toBe(true);
  });

  test('normaliza el correo a minúsculas', () => {
    User.create({ nombre: 'Carlos', correo: 'CARLOS@TEST.COM', password: '123456' });
    const u = User.findByCorreo('carlos@test.com');
    expect(u).toBeDefined();
  });

  test('lanza error UNIQUE en correo duplicado', () => {
    User.create({ nombre: 'D1', correo: 'dup@test.com', password: 'pass123' });
    expect(() => {
      User.create({ nombre: 'D2', correo: 'dup@test.com', password: 'pass123' });
    }).toThrow(/UNIQUE/);
  });

  test('el resultado no expone la contraseña', () => {
    const u = User.create({ nombre: 'Eve', correo: 'eve@test.com', password: 'abc123' });
    expect(u.password).toBeUndefined();
  });
});

describe('User.findByCorreo()', () => {
  test('retorna el usuario con su hash de contraseña', () => {
    User.create({ nombre: 'F', correo: 'f@test.com', password: 'pass123' });
    const u = User.findByCorreo('f@test.com');
    expect(u).toBeDefined();
    expect(u.correo).toBe('f@test.com');
    expect(u.password).toBeDefined(); // findByCorreo sí retorna hash (para verificar login)
  });

  test('retorna undefined si el correo no existe', () => {
    const u = User.findByCorreo('noexiste@test.com');
    expect(u).toBeUndefined();
  });
});

describe('User.findById()', () => {
  test('retorna el usuario sin contraseña', () => {
    const created = User.create({ nombre: 'G', correo: 'g@test.com', password: 'abc123' });
    const found = User.findById(created.id);
    expect(found.nombre).toBe('G');
    expect(found.password).toBeUndefined();
  });

  test('retorna undefined para id inexistente', () => {
    const found = User.findById(99999);
    expect(found).toBeUndefined();
  });
});

describe('User.verificarPassword()', () => {
  test('retorna true con la contraseña correcta', () => {
    User.create({ nombre: 'H', correo: 'h@test.com', password: 'clave123' });
    const raw = db.prepare('SELECT password FROM users WHERE correo = ?').get('h@test.com');
    expect(User.verificarPassword('clave123', raw.password)).toBe(true);
  });

  test('retorna false con contraseña incorrecta', () => {
    User.create({ nombre: 'I', correo: 'i@test.com', password: 'clave123' });
    const raw = db.prepare('SELECT password FROM users WHERE correo = ?').get('i@test.com');
    expect(User.verificarPassword('wrongpass', raw.password)).toBe(false);
  });
});

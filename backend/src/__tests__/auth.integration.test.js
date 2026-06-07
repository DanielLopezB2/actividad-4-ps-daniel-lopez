process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';

const request = require('supertest');
const app = require('../../server');
const db = require('../config/database');

// Usar un sufijo único por suite para evitar colisiones entre archivos de test
const SUFFIX = 'auth';

afterAll(() => {
  db.exec(`DELETE FROM habits`);
  db.exec(`DELETE FROM users WHERE correo LIKE '%_${SUFFIX}@test.com'`);
});

describe('Integración — Flujo de autenticación', () => {
  const correo = `usuario_${SUFFIX}@test.com`;
  let token;

  test('POST /api/auth/register → 201 con token y datos del usuario', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Integ User', correo, password: 'pass1234' });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.usuario.correo).toBe(correo);
    expect(res.body.usuario.password).toBeUndefined();
    token = res.body.token;
  });

  test('POST /api/auth/register — campos obligatorios faltantes → 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Sin correo' });
    expect(res.status).toBe(400);
    expect(res.body.mensaje).toBeDefined();
  });

  test('POST /api/auth/register — contraseña menor a 6 chars → 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Test', correo: `short_${SUFFIX}@test.com`, password: '123' });
    expect(res.status).toBe(400);
  });

  test('POST /api/auth/register — correo duplicado → 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Dup', correo, password: 'pass1234' });
    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch(/ya está registrado/);
  });

  test('POST /api/auth/login → 200 con token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo, password: 'pass1234' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('POST /api/auth/login — campos faltantes → 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo });
    expect(res.status).toBe(400);
  });

  test('POST /api/auth/login — contraseña incorrecta → 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo, password: 'wrongpass' });
    expect(res.status).toBe(401);
    expect(res.body.mensaje).toMatch(/Credenciales/);
  });

  test('POST /api/auth/login — usuario inexistente → 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: 'noexiste@test.com', password: 'cualquiera' });
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/perfil con token válido → 200', async () => {
    const res = await request(app)
      .get('/api/auth/perfil')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.usuario.nombre).toBe('Integ User');
  });

  test('GET /api/auth/perfil sin token → 401', async () => {
    const res = await request(app).get('/api/auth/perfil');
    expect(res.status).toBe(401);
  });

  test('GET /api/health → 200 estado OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.estado).toBe('OK');
  });
});

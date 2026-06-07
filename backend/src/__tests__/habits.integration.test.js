process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';

const request = require('supertest');
const app = require('../../server');
const db = require('../config/database');

const SUFFIX = 'habits';

let token;
let habitId;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ nombre: 'Habits User', correo: `usuario_${SUFFIX}@test.com`, password: 'pass1234' });
  token = res.body.token;
});

afterAll(() => {
  db.exec(`DELETE FROM habits`);
  db.exec(`DELETE FROM users WHERE correo LIKE '%_${SUFFIX}@test.com'`);
});

describe('Integración — CRUD de hábitos', () => {
  test('POST /api/habits — sin token → 401', async () => {
    const res = await request(app)
      .post('/api/habits')
      .send({ nombre: 'Test', categoria: 'salud' });
    expect(res.status).toBe(401);
  });

  test('POST /api/habits — campos faltantes → 400', async () => {
    const res = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Sin categoria' });
    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch(/obligatorios/);
  });

  test('POST /api/habits — categoría inválida → 400', async () => {
    const res = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Test', categoria: 'invalida' });
    expect(res.status).toBe(400);
  });

  test('POST /api/habits → 201 con hábito creado', async () => {
    const res = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Meditar 10min', categoria: 'bienestar', frecuencia: 'diario', hora_recordatorio: '07:00' });
    expect(res.status).toBe(201);
    expect(res.body.habito.nombre).toBe('Meditar 10min');
    expect(res.body.habito.activo).toBe(1);
    habitId = res.body.habito.id;
  });

  test('GET /api/habits → 200 con lista de hábitos', async () => {
    const res = await request(app)
      .get('/api/habits')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.habitos)).toBe(true);
    expect(res.body.habitos.length).toBeGreaterThanOrEqual(1);
  });

  test('PUT /api/habits/:id → 200 con hábito actualizado', async () => {
    const res = await request(app)
      .put(`/api/habits/${habitId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Meditar 20min', descripcion: 'Actualizado' });
    expect(res.status).toBe(200);
    expect(res.body.habito.nombre).toBe('Meditar 20min');
  });

  test('PUT /api/habits/:id — hábito inexistente → 404', async () => {
    const res = await request(app)
      .put('/api/habits/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'X' });
    expect(res.status).toBe(404);
  });

  test('DELETE /api/habits/:id → 200 y hábito desaparece del listado', async () => {
    const del = await request(app)
      .delete(`/api/habits/${habitId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(200);
    expect(del.body.mensaje).toMatch(/eliminado/);

    const list = await request(app)
      .get('/api/habits')
      .set('Authorization', `Bearer ${token}`);
    const ids = list.body.habitos.map(h => h.id);
    expect(ids).not.toContain(habitId);
  });

  test('DELETE /api/habits/:id — hábito inexistente → 404', async () => {
    const res = await request(app)
      .delete('/api/habits/99999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});

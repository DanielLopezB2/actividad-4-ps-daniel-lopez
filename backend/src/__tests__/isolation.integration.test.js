process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';

const request = require('supertest');
const app = require('../../server');
const db = require('../config/database');

const SUFFIX = 'isolation';

let tokenA, tokenB, habitAId;

beforeAll(async () => {
  const rA = await request(app)
    .post('/api/auth/register')
    .send({ nombre: 'UserA', correo: `usera_${SUFFIX}@test.com`, password: 'passA123' });
  tokenA = rA.body.token;

  const rB = await request(app)
    .post('/api/auth/register')
    .send({ nombre: 'UserB', correo: `userb_${SUFFIX}@test.com`, password: 'passB123' });
  tokenB = rB.body.token;

  const hA = await request(app)
    .post('/api/habits')
    .set('Authorization', `Bearer ${tokenA}`)
    .send({ nombre: 'Hábito privado de A', categoria: 'salud' });
  habitAId = hA.body.habito.id;
});

afterAll(() => {
  db.exec(`DELETE FROM habits`);
  db.exec(`DELETE FROM users WHERE correo LIKE '%_${SUFFIX}@test.com'`);
});

describe('Integración — Aislamiento de datos entre usuarios', () => {
  test('UserB no ve los hábitos de UserA en GET /api/habits', async () => {
    const res = await request(app)
      .get('/api/habits')
      .set('Authorization', `Bearer ${tokenB}`);
    expect(res.status).toBe(200);
    const ids = res.body.habitos.map(h => h.id);
    expect(ids).not.toContain(habitAId);
  });

  test('UserB recibe 403 al intentar editar hábito de UserA', async () => {
    const res = await request(app)
      .put(`/api/habits/${habitAId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ nombre: 'Hackeado' });
    expect(res.status).toBe(403);
    expect(res.body.mensaje).toMatch(/permiso/);
  });

  test('UserB recibe 403 al intentar eliminar hábito de UserA', async () => {
    const res = await request(app)
      .delete(`/api/habits/${habitAId}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(res.status).toBe(403);
  });

  test('UserA sí puede editar su propio hábito', async () => {
    const res = await request(app)
      .put(`/api/habits/${habitAId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ nombre: 'Hábito modificado' });
    expect(res.status).toBe(200);
    expect(res.body.habito.nombre).toBe('Hábito modificado');
  });

  test('UserA sí puede eliminar su propio hábito', async () => {
    const res = await request(app)
      .delete(`/api/habits/${habitAId}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(200);
  });
});

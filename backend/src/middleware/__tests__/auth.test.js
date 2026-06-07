process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

const jwt = require('jsonwebtoken');

// Mock del modelo User para no depender de la BD en tests unitarios del middleware
jest.mock('../../models/User', () => ({
  findById: (id) => {
    if (id === 1) return { id: 1, nombre: 'Test', correo: 'test@test.com' };
    return undefined;
  },
}));

const { proteger } = require('../auth');

// Helper para crear un mock de res
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Middleware proteger()', () => {
  test('rechaza si no hay Authorization header', () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();
    proteger(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rechaza si el header no comienza con Bearer', () => {
    const req = { headers: { authorization: 'Token abc123' } };
    const res = mockRes();
    const next = jest.fn();
    proteger(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rechaza token con firma inválida', () => {
    const req = { headers: { authorization: 'Bearer token.invalido.firma' } };
    const res = mockRes();
    const next = jest.fn();
    proteger(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rechaza token expirado', () => {
    const expired = jwt.sign({ id: 1 }, 'test-secret', { expiresIn: '0s' });
    const req = { headers: { authorization: `Bearer ${expired}` } };
    const res = mockRes();
    const next = jest.fn();
    proteger(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rechaza token válido pero de usuario inexistente', () => {
    const token = jwt.sign({ id: 9999 }, 'test-secret', { expiresIn: '1h' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();
    proteger(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('acepta token válido, adjunta usuario a req y llama next()', () => {
    const token = jwt.sign({ id: 1 }, 'test-secret', { expiresIn: '1h' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();
    proteger(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.usuario).toEqual({ id: 1, nombre: 'Test', correo: 'test@test.com' });
  });
});

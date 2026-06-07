process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';

jest.mock('../../models/User', () => ({
  create: jest.fn(),
  findByCorreo: jest.fn(),
  verificarPassword: jest.fn(),
}));

const User = require('../../models/User');
const { register, login, perfil } = require('../authController');

// Helper res mock
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => jest.clearAllMocks());

describe('authController — register()', () => {
  test('400 si faltan campos obligatorios', () => {
    const req = { body: { nombre: 'Test' } };
    const res = mockRes();
    register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ mensaje: expect.stringMatching(/obligatorios/) }));
    expect(User.create).not.toHaveBeenCalled();
  });

  test('400 si contraseña tiene menos de 6 caracteres', () => {
    const req = { body: { nombre: 'Test', correo: 'test@test.com', password: '123' } };
    const res = mockRes();
    register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(User.create).not.toHaveBeenCalled();
  });

  test('400 si el correo ya existe (UNIQUE error)', () => {
    User.create.mockImplementation(() => { throw new Error('UNIQUE constraint failed'); });
    const req = { body: { nombre: 'Test', correo: 'dup@test.com', password: 'pass123' } };
    const res = mockRes();
    register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ mensaje: expect.stringMatching(/ya está registrado/) }));
  });

  test('201 con token y usuario en caso exitoso', () => {
    User.create.mockReturnValue({ id: 1, nombre: 'Test', correo: 'test@test.com' });
    const req = { body: { nombre: 'Test', correo: 'test@test.com', password: 'pass123' } };
    const res = mockRes();
    register(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    const args = res.json.mock.calls[0][0];
    expect(args.token).toBeDefined();
    expect(args.usuario.correo).toBe('test@test.com');
  });

  test('relanza errores inesperados', () => {
    User.create.mockImplementation(() => { throw new Error('DB error inesperado'); });
    const req = { body: { nombre: 'Test', correo: 'x@test.com', password: 'pass123' } };
    const res = mockRes();
    expect(() => register(req, res)).toThrow('DB error inesperado');
  });
});

describe('authController — login()', () => {
  test('400 si faltan correo o contraseña', () => {
    const req = { body: { correo: 'test@test.com' } };
    const res = mockRes();
    login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('401 si el usuario no existe', () => {
    User.findByCorreo.mockReturnValue(undefined);
    const req = { body: { correo: 'noexiste@test.com', password: 'pass123' } };
    const res = mockRes();
    login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('401 si la contraseña es incorrecta', () => {
    User.findByCorreo.mockReturnValue({ id: 1, correo: 'test@test.com', password: 'hash' });
    User.verificarPassword.mockReturnValue(false);
    const req = { body: { correo: 'test@test.com', password: 'wrongpass' } };
    const res = mockRes();
    login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('200 con token y usuario sin contraseña en caso exitoso', () => {
    User.findByCorreo.mockReturnValue({ id: 1, nombre: 'Test', correo: 'test@test.com', password: 'hash' });
    User.verificarPassword.mockReturnValue(true);
    const req = { body: { correo: 'test@test.com', password: 'pass123' } };
    const res = mockRes();
    login(req, res);
    expect(res.status).not.toHaveBeenCalled(); // status implícito 200
    const args = res.json.mock.calls[0][0];
    expect(args.token).toBeDefined();
    expect(args.usuario.password).toBeUndefined();
    expect(args.usuario.correo).toBe('test@test.com');
  });
});

describe('authController — perfil()', () => {
  test('retorna el usuario adjunto al request', () => {
    const req = { usuario: { id: 1, nombre: 'Test', correo: 'test@test.com' } };
    const res = mockRes();
    perfil(req, res);
    expect(res.json).toHaveBeenCalledWith({ usuario: req.usuario });
  });
});

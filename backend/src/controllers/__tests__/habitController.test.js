process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

jest.mock('../../models/Habit', () => ({
  findAllByUser: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
}));

const Habit = require('../../models/Habit');
const { listar, crear, actualizar, eliminar } = require('../habitController');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => jest.clearAllMocks());

describe('habitController — listar()', () => {
  test('retorna lista de hábitos del usuario autenticado', () => {
    const habitos = [{ id: 1, nombre: 'Meditar', usuario_id: 42 }];
    Habit.findAllByUser.mockReturnValue(habitos);
    const req = { usuario: { id: 42 } };
    const res = mockRes();
    listar(req, res);
    expect(Habit.findAllByUser).toHaveBeenCalledWith(42);
    expect(res.json).toHaveBeenCalledWith({ habitos });
  });

  test('retorna arreglo vacío si el usuario no tiene hábitos', () => {
    Habit.findAllByUser.mockReturnValue([]);
    const req = { usuario: { id: 99 } };
    const res = mockRes();
    listar(req, res);
    expect(res.json).toHaveBeenCalledWith({ habitos: [] });
  });
});

describe('habitController — crear()', () => {
  test('400 si faltan nombre o categoría', () => {
    const req = { body: { nombre: 'Sin categoria' }, usuario: { id: 1 } };
    const res = mockRes();
    crear(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ mensaje: expect.stringMatching(/obligatorios/) }));
    expect(Habit.create).not.toHaveBeenCalled();
  });

  test('400 si la categoría es inválida (CHECK error)', () => {
    Habit.create.mockImplementation(() => { throw new Error('CHECK constraint failed'); });
    const req = { body: { nombre: 'Test', categoria: 'invalida' }, usuario: { id: 1 } };
    const res = mockRes();
    crear(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('201 con el hábito creado en caso exitoso', () => {
    const habito = { id: 5, nombre: 'Meditar', categoria: 'bienestar', usuario_id: 1 };
    Habit.create.mockReturnValue(habito);
    const req = {
      body: { nombre: 'Meditar', categoria: 'bienestar', frecuencia: 'diario', hora_recordatorio: '07:00' },
      usuario: { id: 1 },
    };
    const res = mockRes();
    crear(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ habito });
  });

  test('relanza errores inesperados', () => {
    Habit.create.mockImplementation(() => { throw new Error('DB error'); });
    const req = { body: { nombre: 'Test', categoria: 'salud' }, usuario: { id: 1 } };
    const res = mockRes();
    expect(() => crear(req, res)).toThrow('DB error');
  });
});

describe('habitController — actualizar()', () => {
  test('404 si el hábito no existe', () => {
    Habit.findById.mockReturnValue(undefined);
    const req = { params: { id: '99' }, body: { nombre: 'X' }, usuario: { id: 1 } };
    const res = mockRes();
    actualizar(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('403 si el hábito pertenece a otro usuario', () => {
    Habit.findById.mockReturnValue({ id: 1, usuario_id: 2, nombre: 'Ajeno' });
    const req = { params: { id: '1' }, body: { nombre: 'Hack' }, usuario: { id: 1 } };
    const res = mockRes();
    actualizar(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ mensaje: expect.stringMatching(/permiso/) }));
  });

  test('200 con hábito actualizado si es el dueño', () => {
    const original = { id: 1, usuario_id: 1, nombre: 'Original' };
    const updated = { id: 1, usuario_id: 1, nombre: 'Actualizado' };
    Habit.findById.mockReturnValue(original);
    Habit.update.mockReturnValue(updated);
    const req = { params: { id: '1' }, body: { nombre: 'Actualizado' }, usuario: { id: 1 } };
    const res = mockRes();
    actualizar(req, res);
    expect(res.json).toHaveBeenCalledWith({ habito: updated });
  });
});

describe('habitController — eliminar()', () => {
  test('404 si el hábito no existe', () => {
    Habit.findById.mockReturnValue(undefined);
    const req = { params: { id: '99' }, usuario: { id: 1 } };
    const res = mockRes();
    eliminar(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('403 si el hábito pertenece a otro usuario', () => {
    Habit.findById.mockReturnValue({ id: 1, usuario_id: 2 });
    const req = { params: { id: '1' }, usuario: { id: 1 } };
    const res = mockRes();
    eliminar(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('200 y softDelete llamado si es el dueño', () => {
    Habit.findById.mockReturnValue({ id: 1, usuario_id: 1 });
    const req = { params: { id: '1' }, usuario: { id: 1 } };
    const res = mockRes();
    eliminar(req, res);
    expect(Habit.softDelete).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ mensaje: expect.stringMatching(/eliminado/) }));
  });
});

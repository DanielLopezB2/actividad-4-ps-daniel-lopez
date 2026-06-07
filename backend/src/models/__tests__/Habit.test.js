process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

const db = require('../../config/database');
const User = require('../User');
const Habit = require('../Habit');

let userId;

beforeAll(() => {
  const u = User.create({ nombre: 'HabitUser', correo: 'habituser@test.com', password: 'pass123' });
  userId = u.id;
});

beforeEach(() => {
  db.exec('DELETE FROM habits');
});

afterAll(() => {
  db.exec('DELETE FROM habits');
  db.exec('DELETE FROM users');
});

describe('Habit.create()', () => {
  test('crea un hábito con valores por defecto', () => {
    const h = Habit.create({ usuario_id: userId, nombre: 'Meditar', categoria: 'bienestar' });
    expect(h.id).toBeDefined();
    expect(h.frecuencia).toBe('diario');
    expect(h.activo).toBe(1);
    expect(h.descripcion).toBe('');
  });

  test('acepta todas las categorías válidas', () => {
    const categorias = ['salud', 'estudio', 'ejercicio', 'bienestar', 'otro'];
    categorias.forEach((cat, i) => {
      const h = Habit.create({ usuario_id: userId, nombre: `H${i}`, categoria: cat });
      expect(h.categoria).toBe(cat);
    });
  });

  test('acepta frecuencia semanal', () => {
    const h = Habit.create({ usuario_id: userId, nombre: 'Gym', categoria: 'ejercicio', frecuencia: 'semanal' });
    expect(h.frecuencia).toBe('semanal');
  });

  test('guarda hora_recordatorio cuando se provee', () => {
    const h = Habit.create({
      usuario_id: userId, nombre: 'Agua', categoria: 'salud', hora_recordatorio: '08:00',
    });
    expect(h.hora_recordatorio).toBe('08:00');
  });

  test('lanza error CHECK con categoría inválida', () => {
    expect(() => {
      Habit.create({ usuario_id: userId, nombre: 'X', categoria: 'invalida' });
    }).toThrow(/CHECK/);
  });

  test('lanza error CHECK con frecuencia inválida', () => {
    expect(() => {
      Habit.create({ usuario_id: userId, nombre: 'X', categoria: 'salud', frecuencia: 'mensual' });
    }).toThrow(/CHECK/);
  });
});

describe('Habit.findAllByUser()', () => {
  test('retorna solo hábitos activos del usuario', () => {
    const h1 = Habit.create({ usuario_id: userId, nombre: 'H1', categoria: 'salud' });
    const h2 = Habit.create({ usuario_id: userId, nombre: 'H2', categoria: 'estudio' });
    Habit.softDelete(h2.id);
    const lista = Habit.findAllByUser(userId);
    expect(lista).toHaveLength(1);
    expect(lista[0].nombre).toBe('H1');
  });

  test('retorna arreglo vacío si no hay hábitos activos', () => {
    const lista = Habit.findAllByUser(userId);
    expect(lista).toEqual([]);
  });

  test('no retorna hábitos de otro usuario', () => {
    const u2 = User.create({ nombre: 'Otro', correo: 'otro@test.com', password: 'pass123' });
    Habit.create({ usuario_id: u2.id, nombre: 'Privado', categoria: 'otro' });
    const lista = Habit.findAllByUser(userId);
    expect(lista).toHaveLength(0);
    // Eliminar hábitos antes de eliminar el usuario (FK constraint)
    db.exec(`DELETE FROM habits WHERE usuario_id = ${u2.id}`);
    db.exec(`DELETE FROM users WHERE id = ${u2.id}`);
  });
});

describe('Habit.findById()', () => {
  test('retorna el hábito por id', () => {
    const h = Habit.create({ usuario_id: userId, nombre: 'Leer', categoria: 'estudio' });
    const found = Habit.findById(h.id);
    expect(found.nombre).toBe('Leer');
  });

  test('retorna undefined para id inexistente', () => {
    expect(Habit.findById(99999)).toBeUndefined();
  });
});

describe('Habit.update()', () => {
  test('actualiza nombre y categoría', () => {
    const h = Habit.create({ usuario_id: userId, nombre: 'Correr', categoria: 'ejercicio' });
    const updated = Habit.update(h.id, { nombre: 'Correr 5km', categoria: 'salud' });
    expect(updated.nombre).toBe('Correr 5km');
    expect(updated.categoria).toBe('salud');
  });

  test('ignora campos no permitidos (usuario_id no se modifica)', () => {
    const h = Habit.create({ usuario_id: userId, nombre: 'Test', categoria: 'otro' });
    const updated = Habit.update(h.id, { nombre: 'Test2', usuario_id: 99999 });
    expect(updated.usuario_id).toBe(userId);
  });

  test('retorna el hábito sin cambios si no se pasan campos válidos', () => {
    const h = Habit.create({ usuario_id: userId, nombre: 'Sin cambio', categoria: 'otro' });
    const updated = Habit.update(h.id, {});
    expect(updated.nombre).toBe('Sin cambio');
  });
});

describe('Habit.softDelete()', () => {
  test('pone activo=0 sin eliminar el registro', () => {
    const h = Habit.create({ usuario_id: userId, nombre: 'Eliminar', categoria: 'otro' });
    Habit.softDelete(h.id);
    const raw = Habit.findById(h.id);
    expect(raw.activo).toBe(0);
  });

  test('el hábito eliminado no aparece en findAllByUser', () => {
    const h = Habit.create({ usuario_id: userId, nombre: 'Borrar', categoria: 'otro' });
    Habit.softDelete(h.id);
    const lista = Habit.findAllByUser(userId);
    expect(lista.find(x => x.id === h.id)).toBeUndefined();
  });
});

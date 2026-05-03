import { useState, useEffect } from 'react';

const CATEGORIAS = ['salud', 'estudio', 'ejercicio', 'bienestar', 'otro'];
const FRECUENCIAS = ['diario', 'semanal'];

const vacío = { nombre: '', descripcion: '', categoria: 'salud', frecuencia: 'diario', hora_recordatorio: '' };

export default function HabitForm({ habitoEditar, onGuardar, onCancelar, cargando }) {
  const [form, setForm] = useState(vacío);
  const [error, setError] = useState('');

  useEffect(() => {
    if (habitoEditar) {
      setForm({
        nombre: habitoEditar.nombre,
        descripcion: habitoEditar.descripcion || '',
        categoria: habitoEditar.categoria,
        frecuencia: habitoEditar.frecuencia,
        hora_recordatorio: habitoEditar.hora_recordatorio || '',
      });
    } else {
      setForm(vacío);
    }
    setError('');
  }, [habitoEditar]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return setError('El nombre del hábito es obligatorio.');
    setError('');
    await onGuardar(form);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.titulo}>{habitoEditar ? 'Editar hábito' : 'Nuevo hábito'}</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Nombre *</label>
          <input
            style={styles.input}
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: Meditar 10 minutos"
          />

          <label style={styles.label}>Descripción</label>
          <textarea
            style={{ ...styles.input, resize: 'vertical', minHeight: '60px' }}
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Opcional..."
          />

          <label style={styles.label}>Categoría *</label>
          <select style={styles.input} name="categoria" value={form.categoria} onChange={handleChange}>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>

          <label style={styles.label}>Frecuencia</label>
          <select style={styles.input} name="frecuencia" value={form.frecuencia} onChange={handleChange}>
            {FRECUENCIAS.map((f) => (
              <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
            ))}
          </select>

          <label style={styles.label}>Hora de recordatorio</label>
          <input
            style={styles.input}
            type="time"
            name="hora_recordatorio"
            value={form.hora_recordatorio}
            onChange={handleChange}
          />

          <div style={styles.acciones}>
            <button type="button" onClick={onCancelar} style={styles.btnCancelar}>
              Cancelar
            </button>
            <button type="submit" style={styles.btnGuardar} disabled={cargando}>
              {cargando ? 'Guardando...' : habitoEditar ? 'Actualizar' : 'Crear hábito'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
  },
  modal: {
    background: '#1e1e3a', borderRadius: '12px', padding: '2rem',
    width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto',
  },
  titulo: { color: '#e2e8f0', margin: '0 0 1.2rem', fontSize: '1.2rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  label: { color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 },
  input: {
    background: '#2d2d50', border: '1px solid #3d3d60', borderRadius: '8px',
    padding: '0.6rem 0.8rem', color: '#e2e8f0', fontSize: '0.9rem', width: '100%',
    boxSizing: 'border-box',
  },
  error: { color: '#ef4444', fontSize: '0.85rem', margin: '0 0 0.5rem' },
  acciones: { display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', marginTop: '0.5rem' },
  btnCancelar: {
    background: 'transparent', border: '1px solid #4a4a6a', color: '#94a3b8',
    padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer',
  },
  btnGuardar: {
    background: '#7c3aed', border: 'none', color: '#fff',
    padding: '0.6rem 1.4rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
  },
};

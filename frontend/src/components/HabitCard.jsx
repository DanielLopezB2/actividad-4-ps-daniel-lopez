const CATEGORIA_COLOR = {
  salud: '#10b981',
  estudio: '#3b82f6',
  ejercicio: '#f59e0b',
  bienestar: '#8b5cf6',
  otro: '#6b7280',
};

const CATEGORIA_EMOJI = {
  salud: '💚',
  estudio: '📚',
  ejercicio: '🏃',
  bienestar: '🧘',
  otro: '⭐',
};

export default function HabitCard({ habito, onEditar, onEliminar }) {
  const color = CATEGORIA_COLOR[habito.categoria] || '#6b7280';
  const emoji = CATEGORIA_EMOJI[habito.categoria] || '⭐';

  return (
    <div style={{ ...styles.card, borderLeft: `4px solid ${color}` }}>
      <div style={styles.header}>
        <span style={styles.emoji}>{emoji}</span>
        <div style={styles.info}>
          <h3 style={styles.nombre}>{habito.nombre}</h3>
          {habito.descripcion && <p style={styles.desc}>{habito.descripcion}</p>}
        </div>
      </div>

      <div style={styles.tags}>
        <span style={{ ...styles.tag, background: color + '22', color }}>
          {habito.categoria}
        </span>
        <span style={styles.tag}>{habito.frecuencia}</span>
        {habito.hora_recordatorio && (
          <span style={styles.tag}>⏰ {habito.hora_recordatorio}</span>
        )}
      </div>

      <div style={styles.acciones}>
        <button onClick={() => onEditar(habito)} style={styles.btnEdit}>
          Editar
        </button>
        <button onClick={() => onEliminar(habito._id)} style={styles.btnDelete}>
          Eliminar
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#1e1e3a',
    borderRadius: '10px',
    padding: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    transition: 'transform 0.2s',
  },
  header: { display: 'flex', gap: '0.8rem', alignItems: 'flex-start' },
  emoji: { fontSize: '1.8rem', lineHeight: 1 },
  info: { flex: 1 },
  nombre: { margin: 0, color: '#e2e8f0', fontSize: '1rem', fontWeight: 600 },
  desc: { margin: '0.2rem 0 0', color: '#94a3b8', fontSize: '0.85rem' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem' },
  tag: {
    padding: '0.2rem 0.6rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    background: '#2d2d50',
    color: '#94a3b8',
  },
  acciones: { display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' },
  btnEdit: {
    background: 'transparent',
    border: '1px solid #7c3aed',
    color: '#7c3aed',
    padding: '0.3rem 0.8rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  btnDelete: {
    background: 'transparent',
    border: '1px solid #ef4444',
    color: '#ef4444',
    padding: '0.3rem 0.8rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
};

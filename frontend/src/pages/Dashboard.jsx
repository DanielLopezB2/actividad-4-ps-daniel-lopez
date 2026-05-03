import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { habitService } from '../services/api';
import HabitCard from '../components/HabitCard';
import HabitForm from '../components/HabitForm';

export default function Dashboard() {
  const { usuario } = useAuth();
  const [habitos, setHabitos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [habitoEditar, setHabitoEditar] = useState(null);
  const [error, setError] = useState('');

  const cargarHabitos = useCallback(async () => {
    try {
      const res = await habitService.listar();
      setHabitos(res.data.habitos);
    } catch {
      setError('No se pudieron cargar los hábitos.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarHabitos();
  }, [cargarHabitos]);

  const handleGuardar = async (datos) => {
    setGuardando(true);
    try {
      if (habitoEditar) {
        const res = await habitService.actualizar(habitoEditar._id, datos);
        setHabitos((prev) => prev.map((h) => (h._id === habitoEditar._id ? res.data.habito : h)));
      } else {
        const res = await habitService.crear(datos);
        setHabitos((prev) => [res.data.habito, ...prev]);
      }
      setMostrarForm(false);
      setHabitoEditar(null);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar el hábito.');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este hábito?')) return;
    try {
      await habitService.eliminar(id);
      setHabitos((prev) => prev.filter((h) => h._id !== id));
    } catch {
      setError('No se pudo eliminar el hábito.');
    }
  };

  const handleEditar = (habito) => {
    setHabitoEditar(habito);
    setMostrarForm(true);
  };

  const handleCancelar = () => {
    setMostrarForm(false);
    setHabitoEditar(null);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.titulo}>Mis hábitos</h1>
          <p style={styles.subtitulo}>
            {habitos.length === 0
              ? 'Aún no tienes hábitos. ¡Crea el primero!'
              : `Tenés ${habitos.length} hábito${habitos.length !== 1 ? 's' : ''} activo${habitos.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={() => { setHabitoEditar(null); setMostrarForm(true); }} style={styles.btnNuevo}>
          + Nuevo hábito
        </button>
      </div>

      {error && (
        <div style={styles.errorBanner}>
          {error}
          <button onClick={() => setError('')} style={styles.cerrarError}>✕</button>
        </div>
      )}

      {cargando ? (
        <p style={styles.cargando}>Cargando hábitos...</p>
      ) : habitos.length === 0 ? (
        <div style={styles.vacio}>
          <span style={{ fontSize: '4rem' }}>🌱</span>
          <p>Empieza con un pequeño hábito hoy</p>
          <button onClick={() => setMostrarForm(true)} style={styles.btnNuevo}>
            Crear mi primer hábito
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {habitos.map((h) => (
            <HabitCard key={h._id} habito={h} onEditar={handleEditar} onEliminar={handleEliminar} />
          ))}
        </div>
      )}

      {mostrarForm && (
        <HabitForm
          habitoEditar={habitoEditar}
          onGuardar={handleGuardar}
          onCancelar={handleCancelar}
          cargando={guardando}
        />
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem',
  },
  titulo: { color: '#e2e8f0', margin: '0 0 0.3rem', fontSize: '1.6rem' },
  subtitulo: { color: '#94a3b8', margin: 0, fontSize: '0.9rem' },
  btnNuevo: {
    background: '#7c3aed', border: 'none', color: '#fff',
    padding: '0.7rem 1.4rem', borderRadius: '8px', cursor: 'pointer',
    fontWeight: 600, fontSize: '0.95rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
  },
  vacio: {
    textAlign: 'center', color: '#94a3b8', padding: '4rem 2rem',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
  },
  cargando: { color: '#94a3b8', textAlign: 'center', padding: '3rem' },
  errorBanner: {
    background: '#ef44441a', border: '1px solid #ef4444', borderRadius: '8px',
    color: '#ef4444', padding: '0.8rem 1rem', marginBottom: '1.5rem',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  cerrarError: {
    background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem',
  },
};

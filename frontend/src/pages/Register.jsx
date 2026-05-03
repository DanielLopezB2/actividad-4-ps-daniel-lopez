import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ nombre: '', correo: '', password: '', confirmar: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmar) {
      return setError('Las contraseñas no coinciden.');
    }
    if (form.password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres.');
    }

    setCargando(true);
    try {
      await register(form.nombre, form.correo, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrarse.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>🌱</div>
        <h1 style={styles.titulo}>Crear cuenta</h1>
        <p style={styles.subtitulo}>Empieza tu camino hacia mejores hábitos</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={form.correo}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Contraseña (mín. 6 caracteres)"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="confirmar"
            placeholder="Confirmar contraseña"
            value={form.confirmar}
            onChange={handleChange}
            required
          />
          <button type="submit" style={styles.btn} disabled={cargando}>
            {cargando ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <p style={styles.link}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={styles.anchor}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#0f0f23', padding: '1rem',
  },
  card: {
    background: '#1a1a2e', borderRadius: '16px', padding: '2.5rem 2rem',
    width: '100%', maxWidth: '400px', textAlign: 'center',
    boxShadow: '0 8px 32px rgba(124,58,237,0.2)',
  },
  logo: { fontSize: '3rem', marginBottom: '0.5rem' },
  titulo: { color: '#e2e8f0', margin: '0 0 0.3rem', fontSize: '1.6rem' },
  subtitulo: { color: '#94a3b8', margin: '0 0 1.5rem', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.2rem' },
  input: {
    background: '#2d2d50', border: '1px solid #3d3d60', borderRadius: '8px',
    padding: '0.8rem 1rem', color: '#e2e8f0', fontSize: '0.95rem', outline: 'none',
  },
  btn: {
    background: '#7c3aed', border: 'none', color: '#fff', padding: '0.85rem',
    borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem',
    marginTop: '0.4rem',
  },
  error: { color: '#ef4444', fontSize: '0.85rem', margin: '0 0 1rem' },
  link: { color: '#94a3b8', fontSize: '0.9rem' },
  anchor: { color: '#7c3aed', textDecoration: 'none', fontWeight: 600 },
};

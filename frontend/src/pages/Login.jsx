import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ correo: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await login(form.correo, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>🌱</div>
        <h1 style={styles.titulo}>HabitFlow</h1>
        <p style={styles.subtitulo}>Tus hábitos, tu bienestar</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
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
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" style={styles.btn} disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p style={styles.link}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={styles.anchor}>
            Regístrate
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
  titulo: { color: '#e2e8f0', margin: '0 0 0.3rem', fontSize: '1.8rem' },
  subtitulo: { color: '#94a3b8', margin: '0 0 2rem', fontSize: '0.9rem' },
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

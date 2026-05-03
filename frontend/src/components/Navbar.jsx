import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.brand}>
        🌱 HabitFlow
      </Link>
      {usuario && (
        <div style={styles.right}>
          <span style={styles.nombre}>Hola, {usuario.nombre.split(' ')[0]}</span>
          <button onClick={handleLogout} style={styles.btn}>
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: '#1a1a2e',
    color: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  brand: {
    textDecoration: 'none',
    color: '#7c3aed',
    fontWeight: 700,
    fontSize: '1.3rem',
  },
  right: { display: 'flex', alignItems: 'center', gap: '1rem' },
  nombre: { color: '#a0aec0', fontSize: '0.9rem' },
  btn: {
    background: 'transparent',
    border: '1px solid #7c3aed',
    color: '#7c3aed',
    padding: '0.4rem 0.9rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
};

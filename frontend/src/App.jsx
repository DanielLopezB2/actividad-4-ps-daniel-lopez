import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const RutaPrivada = ({ children }) => {
  const { usuario, cargando } = useAuth();
  if (cargando) return <div style={{ color: '#94a3b8', textAlign: 'center', paddingTop: '4rem' }}>Cargando...</div>;
  return usuario ? children : <Navigate to="/login" replace />;
};

const RutaPublica = ({ children }) => {
  const { usuario, cargando } = useAuth();
  if (cargando) return null;
  return usuario ? <Navigate to="/dashboard" replace /> : children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ minHeight: '100vh', background: '#0f0f23', fontFamily: 'Inter, sans-serif' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<RutaPublica><Login /></RutaPublica>} />
            <Route path="/register" element={<RutaPublica><Register /></RutaPublica>} />
            <Route path="/dashboard" element={<RutaPrivada><Dashboard /></RutaPrivada>} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

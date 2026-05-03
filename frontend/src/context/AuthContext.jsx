import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('habitflow_token');
    if (!token) {
      setCargando(false);
      return;
    }
    authService
      .perfil()
      .then((res) => setUsuario(res.data.usuario))
      .catch(() => localStorage.removeItem('habitflow_token'))
      .finally(() => setCargando(false));
  }, []);

  const login = async (correo, password) => {
    const res = await authService.login({ correo, password });
    localStorage.setItem('habitflow_token', res.data.token);
    setUsuario(res.data.usuario);
  };

  const register = async (nombre, correo, password) => {
    const res = await authService.register({ nombre, correo, password });
    localStorage.setItem('habitflow_token', res.data.token);
    setUsuario(res.data.usuario);
  };

  const logout = () => {
    localStorage.removeItem('habitflow_token');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, revisa si ya hay sesión guardada
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      const respuesta = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          email,
          password,
        },
      );
      localStorage.setItem("token", respuesta.data.token);
      localStorage.setItem("user", JSON.stringify(respuesta.data.usuario));
      setUser(respuesta.data.usuario);
      return true;
    } catch (error) {
      alert(error.response?.data?.error || "Error al iniciar sesión");
      return false;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;

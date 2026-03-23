// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    const rawToken = localStorage.getItem("token");
    if (rawUser && rawToken) {
      setUser(JSON.parse(rawUser));
      setToken(rawToken);
    }
    setLoading(false);
  }, []);

  const login = ({ user: u, token: t }) => {
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("token", t);
    setUser(u);
    setToken(t);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, token, loading } = useAuth();

  if (loading) return null; // hoặc spinner

  if (!token) return <Navigate to="/login" />;

  if (role && user?.role !== role) return <Navigate to="/" />;

  return children;
}

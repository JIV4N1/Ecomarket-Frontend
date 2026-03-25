// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <p style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>
        Cargando...
      </p>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;

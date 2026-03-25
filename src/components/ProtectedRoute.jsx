// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

function ProtectedRoute({
  children,
  adminOnly = false,
  requireNormalUser = false,
}) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <p style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>
        Cargando...
      </p>
    );
  }

  if (!user) {
    Swal.fire({
      icon: "warning",
      title: "Acceso denegado",
      text: "Debes iniciar sesión para acceder a esta página",
      confirmButtonColor: "#3b82f6",
    });
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    Swal.fire({
      icon: "error",
      title: "Acceso denegado",
      text: "No tienes permisos de administrador",
      confirmButtonColor: "#3b82f6",
    });
    return <Navigate to="/" replace />;
  }

  if (requireNormalUser && user.role === "admin") {
    Swal.fire({
      icon: "warning",
      title: "Acceso denegado",
      text: "Los administradores no pueden acceder a esta sección",
      confirmButtonColor: "#3b82f6",
    });
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;

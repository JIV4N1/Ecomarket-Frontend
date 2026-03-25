// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setCargando(true);

    try {
      const respuesta = await axios.post(
        "http://localhost:4000/api/auth/registro",
        {
          nombre,
          email,
          password,
        },
      );

      if (respuesta.data.success) {
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        navigate("/login");
      } else {
        setError(respuesta.data.error || "Error al registrarse");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      setError(
        error.response?.data?.error || "Error de conexión con el servidor",
      );
    } finally {
      setCargando(false);
    }
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
    },
    formCard: {
      backgroundColor: "#1e293b",
      padding: "30px",
      borderRadius: "8px",
      width: "100%",
      maxWidth: "400px",
      border: "1px solid #334155",
    },
    title: {
      textAlign: "center",
      color: "#3b82f6",
      marginBottom: "25px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    },
    label: {
      color: "#e2e8f0",
      fontSize: "0.9rem",
    },
    input: {
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #475569",
      backgroundColor: "#0f172a",
      color: "white",
      fontSize: "1rem",
    },
    button: {
      padding: "10px",
      backgroundColor: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "1rem",
      marginTop: "10px",
    },
    buttonDisabled: {
      padding: "10px",
      backgroundColor: "#475569",
      color: "#94a3b8",
      border: "none",
      borderRadius: "4px",
      fontSize: "1rem",
      marginTop: "10px",
    },
    error: {
      color: "#ef4444",
      fontSize: "0.9rem",
      textAlign: "center",
      marginTop: "10px",
    },
    loginLink: {
      textAlign: "center",
      marginTop: "20px",
      color: "#94a3b8",
    },
    link: {
      color: "#3b82f6",
      textDecoration: "none",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Crear Cuenta</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nombre Completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={cargando ? styles.buttonDisabled : styles.button}
          >
            {cargando ? "Registrando..." : "Registrarse"}
          </button>

          {error && <p style={styles.error}>{error}</p>}
        </form>

        <div style={styles.loginLink}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" style={styles.link}>
            Inicia Sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;

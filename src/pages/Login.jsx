import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const exito = await login(email, password);
    if (exito) {
      navigate("/");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={{ textAlign: "center", color: "#3b82f6" }}>
          Iniciar Sesión
        </h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label>Email</label>
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="*******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Entrar
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "15px" }}>
          ¿No tienes cuenta?{" "}
          <Link to="/registro" style={{ color: "#3b82f6" }}>
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

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
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #475569",
    backgroundColor: "#0f172a",
    color: "white",
  },
  button: {
    padding: "10px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Login;

import { Link } from "react-router-dom";

function Register() {
  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={{ textAlign: "center", color: "#3b82f6" }}>Crear Cuenta</h2>
        <form style={styles.form}>
          <label>Nombre</label>
          <input type="text" placeholder="Tu nombre" style={styles.input} />
          <label>Email</label>
          <input type="email" placeholder="tu@email.com" style={styles.input} />
          <label>Contraseña</label>
          <input type="password" placeholder="*******" style={styles.input} />
          <button type="submit" style={styles.button}>
            Registrarse
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "15px" }}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" style={{ color: "#3b82f6", cursor: "pointer" }}>
            Inicia sesión
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

export default Register;

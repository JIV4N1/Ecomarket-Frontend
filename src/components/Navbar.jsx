import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const nombreTienda = "EcoMarket Pro";
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logoLink}>
        <h1 style={styles.logo}>{nombreTienda}</h1>
      </Link>
      <ul style={styles.menu}>
        <li>
          <Link to="/" style={styles.link}>
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/" style={styles.link}>
            Catálogo
          </Link>
        </li>
        {user ? (
          <>
            <li style={styles.link}>Hola, {user.nombre}</li>
            <li>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Cerrar Sesión
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login" style={styles.link}>
              Iniciar Sesión
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1e293b",
    color: "white",
    padding: "10px 20px",
  },
  logoLink: { textDecoration: "none" },
  logo: { margin: 0, color: "#3b82f6" },
  menu: { listStyle: "none", display: "flex", gap: "15px", margin: 0 },
  link: {
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "none",
    color: "white",
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Navbar;

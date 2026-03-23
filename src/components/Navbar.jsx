import { Link } from "react-router-dom";

function Navbar() {
  const nombreTienda = "EcoMarket Pro";

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
        <li>
          <Link to="/login" style={styles.link}>
            Iniciar Sesión
          </Link>
        </li>
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
};

export default Navbar;

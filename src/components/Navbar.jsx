// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const nombreTienda = "EcoMarket Pro";
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  // Calcular el número total de artículos en el carrito
  const totalArticulos = cart.reduce((total, item) => total + item.cantidad, 0);

  // Determinar si es admin
  const esAdmin = user?.role === "admin";
  const estaLogueado = !!user;

  const styles = {
    nav: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#1e293b",
      color: "white",
      padding: "10px 20px",
      flexWrap: "wrap",
      gap: "10px",
    },
    logoLink: {
      textDecoration: "none",
    },
    logo: {
      margin: 0,
      color: "#3b82f6",
    },
    menu: {
      listStyle: "none",
      display: "flex",
      gap: "20px",
      margin: 0,
      padding: 0,
      alignItems: "center",
      flexWrap: "wrap",
    },
    link: {
      cursor: "pointer",
      fontWeight: "bold",
      textDecoration: "none",
      color: "white",
      transition: "color 0.2s",
    },
    userInfo: {
      color: "#3b82f6",
      marginRight: "10px",
    },
    logoutButton: {
      backgroundColor: "#ef4444",
      border: "none",
      color: "white",
      padding: "5px 10px",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "background-color 0.2s",
    },
    cartLink: {
      cursor: "pointer",
      fontWeight: "bold",
      textDecoration: "none",
      color: "white",
      backgroundColor: "#3b82f6",
      padding: "5px 12px",
      borderRadius: "20px",
      display: "inline-block",
      transition: "background-color 0.2s",
    },
    adminBadge: {
      backgroundColor: "#f59e0b",
      color: "#1e293b",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "0.8rem",
      fontWeight: "bold",
      marginLeft: "10px",
    },
    adminLink: {
      cursor: "pointer",
      fontWeight: "bold",
      textDecoration: "none",
      color: "#f59e0b",
      backgroundColor: "rgba(245, 158, 11, 0.1)",
      padding: "5px 12px",
      borderRadius: "4px",
      display: "inline-block",
      transition: "background-color 0.2s",
    },
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logoLink}>
        <h1 style={styles.logo}>{nombreTienda}</h1>
      </Link>

      <ul style={styles.menu}>
        {/* Catálogo - visible para todos */}
        <li>
          <Link to="/" style={styles.link}>
            {" "}
            Catálogo
          </Link>
        </li>

        {/* Menús para ADMIN */}
        {esAdmin && (
          <li>
            <Link to="/admin" style={styles.adminLink}>
              Panel Admin
            </Link>
          </li>
        )}

        {/* Menús para USUARIOS NORMALES (logueados, no admin) */}
        {estaLogueado && !esAdmin && (
          <>
            <li>
              <Link to="/carrito" style={styles.cartLink}>
                Carrito {totalArticulos > 0 && `(${totalArticulos})`}
              </Link>
            </li>
            <li>
              <Link to="/mis-compras" style={styles.link}>
                Mis Compras
              </Link>
            </li>
          </>
        )}

        {/* Menús para INVITADOS (no logueados) */}
        {!estaLogueado && (
          <>
            <li>
              <Link to="/login" style={styles.link}>
                {" "}
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link to="/registro" style={styles.link}>
                {" "}
                Registrarse
              </Link>
            </li>
          </>
        )}

        {/* Usuario logueado (tanto admin como normal) */}
        {estaLogueado && (
          <>
            <li style={styles.userInfo}>
              Hola, {user.nombre || user.email}
              {esAdmin && <span style={styles.adminBadge}>ADMIN</span>}
            </li>
            <li>
              <button onClick={logout} style={styles.logoutButton}>
                Cerrar Sesión
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;

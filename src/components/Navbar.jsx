//Un componente en React es simplemente una función de JavScript que retorna JSX
function Navbar() {
  //Lógica de JavaScript aquí arriba (variables, funciones)
  const nombreTienda = "EcoMarket Pro";

  //Retorno de la interfaz gráfica (JSX) aquí abajo
  return (
    <nav style={styles.nav}>
      <h1 style={styles.logo}>{nombreTienda}</h1>
      <ul style={styles.menu}>
        <li style={styles.link}>Inicio</li>
        <li style={styles.link}>Catalogo</li>
        <li style={styles.link}>Iniciar Sesion</li>
      </ul>
    </nav>
  );
}

//Objeto de estilos (En React podemos usar CSS en línea mediante objetos JS)
const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E293b",
    color: "white",
    padding: "10px 20px",
  },
  logo: { margin: 0, color: "#3b82f6" },
  menu: { listStyle: "none", display: "flex", gap: "15px", margin: 0 },
  link: { cursor: "pointer", fontWeight: "bold" },
};
export default Navbar;

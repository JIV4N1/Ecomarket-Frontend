//Un componente en React es simplemente una función de JavScript que retorna JSX
function FootBar() {
  //Retorno de la interfaz gráfica (JSX) aquí abajo
  return (
    <nav style={styles.nav}>
      <nav>
        <h2>© 2026 EcoMarket API. Todos los derechos reservados</h2>
      </nav>
    </nav>
  );
}

//Objeto de estilos (En React podemos usar CSS en línea mediante objetos JS)
const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#484a4d",
    color: "white",
    padding: "10px 20px",
  },
  logo: { margin: 0, color: "#3b82f6" },
  menu: { listStyle: "none", display: "flex", gap: "15px", margin: 0 },
  link: { cursor: "pointer", fontWeight: "bold" },
};
export default FootBar;

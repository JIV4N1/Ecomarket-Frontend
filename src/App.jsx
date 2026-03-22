import FootBar from "./components/Footer";
import Navbar from "./components/Navbar";
import CardProduct from "./components/ProductCard";
import ProductList from "./components/ProductList";

function App() {
  return (
    //2. En JSX, debes retornar un único elemento padre.
    //Usamos un div o fragmentos vacíos <></> para envolber todo.

    <div
      style={{ backgroundColor: "#0f172a", minHeight: "100vh", color: "white" }}
    >
      {/* 3. Invocamos el componente como si fuera una etiqueta HTML */}
      <Navbar />
      <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <h2>Bienvenido a la tienda</h2>
        <p>El portal está en construcción.</p>

        <ProductList />
      </main>

      <FootBar />
      <div></div>
    </div>
  );
}

export default App;

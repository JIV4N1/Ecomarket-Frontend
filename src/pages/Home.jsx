import ProductList from "../components/ProductList";

function Home() {
  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        Catálogo de Productos
      </h2>
      <ProductList />
    </div>
  );
}

export default Home;

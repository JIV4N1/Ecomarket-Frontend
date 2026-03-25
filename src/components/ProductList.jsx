// src/components/ProductList.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

function ProductList() {
  //1- Declaración del Estado
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Función para obtener productos (la extraemos para poder reutilizarla)
  const obtenerProductos = async () => {
    try {
      setCargando(true);
      // Hacemos la petición GET a nuestro backend
      const respuesta = await axios.get(
        "http://localhost:4000/api/products?limit=100",
      );

      console.log("Productos recibidos:", respuesta.data);

      // Manejar diferentes estructuras de respuesta
      let productosData = [];
      if (respuesta.data.data && Array.isArray(respuesta.data.data)) {
        productosData = respuesta.data.data;
      } else if (Array.isArray(respuesta.data)) {
        productosData = respuesta.data;
      } else if (
        respuesta.data.products &&
        Array.isArray(respuesta.data.products)
      ) {
        productosData = respuesta.data.products;
      }

      setProductos(productosData);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setCargando(false);
    }
  };

  //2. Efecto Secundario: Conexión a la API al montar el componente
  useEffect(() => {
    obtenerProductos();

    // Escuchar evento personalizado cuando se crea un nuevo producto
    const handleProductoCreado = () => {
      console.log("🔄 Nuevo producto detectado, recargando catálogo...");
      obtenerProductos();
    };

    // Escuchar evento de actualización manual (opcional)
    const handleActualizarCatalogo = () => {
      console.log("🔄 Actualización manual del catálogo...");
      obtenerProductos();
    };

    // Agregar event listeners
    window.addEventListener("productoCreado", handleProductoCreado);
    window.addEventListener("actualizarCatalogo", handleActualizarCatalogo);

    // Cleanup: remover event listeners cuando el componente se desmonte
    return () => {
      window.removeEventListener("productoCreado", handleProductoCreado);
      window.removeEventListener(
        "actualizarCatalogo",
        handleActualizarCatalogo,
      );
    };
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez

  //3. Renderizado Condicional
  if (cargando) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ color: "#94a3b8" }}>🔄 Cargando productos...</h2>
      </div>
    );
  }

  // Si no hay productos
  if (productos.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ color: "#94a3b8" }}>📦 No hay productos disponibles</h2>
        <p style={{ color: "#64748b" }}>
          Los administradores pueden agregar productos desde el panel de control
        </p>
      </div>
    );
  }

  //4. Renderizado de la lista (mapeo)
  return (
    <div style={styles.grid}>
      {productos.map((prod) => (
        <ProductCard key={prod.id} producto={prod} />
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    justifyContent: "center",
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
};

export default ProductList;

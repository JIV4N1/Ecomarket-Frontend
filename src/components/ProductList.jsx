import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

function ProductList() {
  //1- Declaración del Estado
  // 'productos' guardará la lista de la BD. 'cargando' mostrará un indicador visual.
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  //2. Efecto Secundario: Conexión a la API
  useEffect(() => {
    //Creamos una función asíncrona dentro del useEffect
    const obtenerProductos = async () => {
      try {
        //Hacemos la petición GET a nuestro backend ()
        const respuesta = await axios.get("http://localhost:4000/api/products");

        //Asumimos que la API devuelve {succes: true, data}
        setProductos(respuesta.data.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setCargando(false);
      }
    };

    //Ejecutamos la función
    obtenerProductos();
  }, []); //El array vacío [] asegura que el efecto se ejecute solo una vez al montar el componente

  //3. Renderizado Condicional
  if (cargando) {
    return (
      <h2 style={{ textAlign: "center", color: "#94a3b8" }}>
        Cargando productos...
      </h2>
    );
  }

  //4. Renderizado de la lista (mapeo)
  return (
    <div style={styles.grid}>
      {/*Iteramos sobre el arreglo de productos usando .map() */}
      {productos.map((prod) => (
        //En react, al crear listas dinámicas, CADA elemento debe tener una 'key' única (su ID de BD)
        <ProductCard key={prod.id} producto={prod} />
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
    padding: "20px",
  },
};

export default ProductList;

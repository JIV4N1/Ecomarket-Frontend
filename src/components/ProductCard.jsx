import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({ producto }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div style={styles.card}>
      <img
        src={
          producto.imagen_url
            ? `http://localhost:4000/${producto.imagen_url}`
            : "https://placehold.co/150"
        }
        alt={producto.nombre}
        style={styles.image}
      />
      <div style={styles.info}>
        <h3 style={styles.title}>{producto.nombre}</h3>
        <p style={styles.price}>${producto.precio}</p>
        <p style={styles.stock}>Stock disponible: {producto.stock}</p>
        {producto.stock > 0 ? (
          <button style={styles.button} onClick={() => addToCart(producto)}>
            Añadir al carrito
          </button>
        ) : (
          <button style={styles.buttonDisabled} disabled>
            Agotado
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #334155",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#1e293b",
    color: "white",
    width: "250px",
  },
  image: { width: "100%", height: "150px", objectFit: "cover" },
  info: { padding: "15px" },
  title: { margin: "0 0 10px 0", fontSize: "1.2rem", color: "#3b82f6" },
  price: { fontSize: "1.5rem", fontWeight: "bold", margin: "0 0 10px 0" },
  stock: { fontSize: "0.9rem", color: "#94a3b8", marginBottom: "15px" },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  buttonDisabled: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#475569",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "not-allowed",
  },
};

export default ProductCard;

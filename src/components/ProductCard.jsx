// src/components/ProductCard.jsx
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

function ProductCard({ producto }) {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Determinar si es administrador
  const esAdmin = user?.role === "admin";

  // 🔥 FUNCIÓN PARA OBTENER LA URL CORRECTA DE LA IMAGEN 🔥
  const obtenerUrlImagen = () => {
    // Si no hay imagen, usar placeholder
    if (!producto.imagen_url && !producto.imagenUrl && !producto.imagen) {
      return "https://placehold.co/300x200?text=Sin+Imagen";
    }

    // Obtener el nombre del archivo de imagen
    const imagenPath =
      producto.imagen_url || producto.imagenUrl || producto.imagen;

    // Si ya es una URL completa (http://...), usarla directamente
    if (imagenPath.startsWith("http")) {
      return imagenPath;
    }

    // Si es una ruta que ya incluye 'uploads/', limpiarla
    let nombreImagen = imagenPath;

    // Si la ruta incluye 'uploads\\' o 'uploads/', extraer solo el nombre del archivo
    if (imagenPath.includes("uploads\\") || imagenPath.includes("uploads/")) {
      // Extraer solo el nombre del archivo (después de la última barra)
      const partes = imagenPath.split(/[\\/]/);
      nombreImagen = partes[partes.length - 1];
    }

    // Construir URL completa para el backend
    // Asegúrate de que el backend esté corriendo en el puerto 4000
    return `http://localhost:4000/uploads/${nombreImagen}`;
  };

  const handleAddToCart = () => {
    if (esAdmin) {
      Swal.fire({
        icon: "warning",
        title: "Acción no permitida",
        text: "Los administradores no pueden agregar productos al carrito",
        toast: true,
        timer: 2000,
        showConfirmButton: false,
        position: "top-end",
      });
      return;
    }

    if (producto.stock > 0) {
      addToCart(producto);
      Swal.fire({
        icon: "success",
        title: "¡Añadido!",
        text: `${producto.nombre} se agregó al carrito`,
        toast: true,
        timer: 2000,
        showConfirmButton: false,
        position: "top-end",
      });
    }
  };

  // Determinar qué botón mostrar
  const renderButton = () => {
    if (esAdmin) {
      return (
        <button style={styles.buttonAdmin} disabled>
          👑 Modo Admin
        </button>
      );
    }

    if (producto.stock > 0) {
      return (
        <button style={styles.button} onClick={handleAddToCart}>
          🛒 Añadir al carrito
        </button>
      );
    }

    return (
      <button style={styles.buttonDisabled} disabled>
        ❌ Agotado
      </button>
    );
  };

  const imagenUrl = obtenerUrlImagen();
  console.log(`Imagen para ${producto.nombre}:`, imagenUrl); // Para depuración

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img
          src={imagenUrl}
          alt={producto.nombre}
          style={styles.image}
          onError={(e) => {
            // Si la imagen falla al cargar, mostrar placeholder
            console.error(`Error cargando imagen: ${imagenUrl}`);
            e.target.src = "https://placehold.co/300x200?text=Error+Imagen";
          }}
        />
      </div>
      <div style={styles.info}>
        <h3 style={styles.title}>{producto.nombre}</h3>
        <p style={styles.price}>${producto.precio}</p>
        <p style={styles.stock}>
          Stock disponible: {producto.stock}
          {esAdmin && <span style={styles.adminBadge}> (Solo lectura)</span>}
        </p>
        {renderButton()}
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
    width: "280px",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    },
  },
  imageContainer: {
    width: "100%",
    height: "180px",
    overflow: "hidden",
    backgroundColor: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.2s",
  },
  info: { padding: "15px" },
  title: {
    margin: "0 0 10px 0",
    fontSize: "1.1rem",
    color: "#e2e8f0",
    fontWeight: "bold",
  },
  price: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    margin: "0 0 10px 0",
    color: "#3b82f6",
  },
  stock: {
    fontSize: "0.85rem",
    color: "#94a3b8",
    marginBottom: "15px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.2s",
  },
  buttonAdmin: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#f59e0b",
    color: "#1e293b",
    border: "none",
    borderRadius: "4px",
    cursor: "not-allowed",
    fontWeight: "bold",
  },
  buttonDisabled: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#475569",
    color: "#94a3b8",
    border: "none",
    borderRadius: "4px",
    cursor: "not-allowed",
    fontWeight: "bold",
  },
  adminBadge: {
    fontSize: "0.7rem",
    color: "#f59e0b",
    marginLeft: "5px",
  },
};

export default ProductCard;

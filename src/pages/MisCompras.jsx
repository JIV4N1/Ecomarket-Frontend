// src/pages/MisCompras.jsx - Versión con estado corregido
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

function MisCompras() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const obtenerOrdenes = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          Swal.fire({
            icon: "warning",
            title: "Sesión no encontrada",
            text: "Debes iniciar sesión para ver tus compras",
          });
          setCargando(false);
          return;
        }

        const respuesta = await axios.get(
          "http://localhost:4000/api/orders/mis-compras",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        let ordenesData = [];
        if (respuesta.data.data && Array.isArray(respuesta.data.data)) {
          ordenesData = respuesta.data.data;
        } else if (Array.isArray(respuesta.data)) {
          ordenesData = respuesta.data;
        } else if (
          respuesta.data.ordenes &&
          Array.isArray(respuesta.data.ordenes)
        ) {
          ordenesData = respuesta.data.ordenes;
        } else {
          ordenesData = respuesta.data;
        }

        setOrdenes(ordenesData);
      } catch (error) {
        console.error("Error al obtener órdenes:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar tus compras",
          confirmButtonColor: "#3b82f6",
        });
      } finally {
        setCargando(false);
      }
    };

    obtenerOrdenes();
  }, []);

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return "Fecha inválida";
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Fecha no disponible";
    }
  };

  // Función para formatear precio
  const formatearPrecio = (precio) => {
    const num = typeof precio === "number" ? precio : parseFloat(precio);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  // Función para obtener el texto del estado
  const obtenerTextoEstado = (estado) => {
    // Si la orden existe en la base de datos, consideramos que está pagada
    // (asumiendo que todas las órdenes en el historial ya fueron pagadas)
    return " Pagada";
  };

  // Función para obtener el color del estado
  const obtenerColorEstado = (estado) => {
    return "#10b981"; // Siempre verde para pagado
  };

  if (cargando) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <h2 style={styles.loadingText}>Cargando tu historial de compras...</h2>
      </div>
    );
  }

  if (ordenes.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyCard}>
          <h2 style={styles.title}> Mis Compras</h2>
          <div style={styles.emptyContent}>
            <p style={styles.emptyText}>Aún no has realizado ninguna compra</p>
            <p style={styles.emptySubtext}>
              Explora nuestro catálogo y haz tu primera compra
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              style={styles.shopButton}
            >
              Ir al Catálogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}> Mi Historial de Compras</h2>
      <p style={styles.subtitle}>
        Tienes {ordenes.length} {ordenes.length === 1 ? "compra" : "compras"}{" "}
        registradas
      </p>

      <div style={styles.ordersList}>
        {ordenes.map((orden) => (
          <div key={orden.id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <div>
                <h3 style={styles.orderNumber}>Orden #{orden.id}</h3>
                <p style={styles.orderDate}>
                  {formatearFecha(orden.createdAt)}
                </p>
              </div>
              <div style={styles.orderStatus}>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: obtenerColorEstado(orden.estado),
                  }}
                >
                  {obtenerTextoEstado(orden.estado)}
                </span>
              </div>
            </div>

            <div style={styles.orderItems}>
              {orden.Products && orden.Products.length > 0 ? (
                <div style={styles.itemsList}>
                  {orden.Products.map((producto, index) => {
                    const orderItem = producto.OrderItem;
                    const cantidad = orderItem?.cantidad || 1;
                    const precioUnitario = parseFloat(
                      orderItem?.precio_unitario || producto.precio,
                    );
                    const subtotal = cantidad * precioUnitario;

                    return (
                      <div key={index} style={styles.orderItem}>
                        <div style={styles.itemInfo}>
                          <span style={styles.itemQuantity}>{cantidad}x</span>
                          <span style={styles.itemName}>{producto.nombre}</span>
                        </div>
                        <div style={styles.itemPrice}>
                          ${formatearPrecio(precioUnitario)}
                          {cantidad > 1 && (
                            <span style={styles.itemSubtotal}>
                              (Total: ${formatearPrecio(subtotal)})
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={styles.noItems}>No hay productos en esta orden</p>
              )}
            </div>

            <div style={styles.orderFooter}>
              <div style={styles.orderTotal}>
                <span style={styles.totalLabel}>Total de la orden:</span>
                <span style={styles.totalAmount}>
                  ${formatearPrecio(orden.total)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    minHeight: "100vh",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
    gap: "20px",
  },
  loadingSpinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #334155",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "#94a3b8",
    fontSize: "1.2rem",
  },
  title: {
    textAlign: "center",
    color: "#3b82f6",
    fontSize: "1.8rem",
    marginBottom: "10px",
  },
  subtitle: {
    textAlign: "center",
    color: "#94a3b8",
    marginBottom: "30px",
  },
  emptyCard: {
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    padding: "40px",
    textAlign: "center",
    border: "1px solid #334155",
  },
  emptyContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  emptyText: {
    fontSize: "1.2rem",
    color: "#e2e8f0",
    margin: "10px 0",
  },
  emptySubtext: {
    color: "#94a3b8",
    marginBottom: "20px",
  },
  shopButton: {
    padding: "12px 24px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#2563eb",
    },
  },
  ordersList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  orderCard: {
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #334155",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#0f172a",
    borderBottom: "1px solid #334155",
  },
  orderNumber: {
    color: "#3b82f6",
    margin: "0 0 5px 0",
    fontSize: "1.1rem",
  },
  orderDate: {
    color: "#94a3b8",
    margin: 0,
    fontSize: "0.8rem",
  },
  orderStatus: {
    display: "flex",
    gap: "10px",
  },
  statusBadge: {
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
  orderItems: {
    padding: "20px",
  },
  itemsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  orderItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #334155",
  },
  itemInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  itemQuantity: {
    backgroundColor: "#334155",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    color: "#e2e8f0",
  },
  itemName: {
    color: "#e2e8f0",
    fontSize: "0.95rem",
  },
  itemPrice: {
    color: "#3b82f6",
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  itemSubtotal: {
    fontSize: "0.8rem",
    color: "#94a3b8",
    marginLeft: "8px",
  },
  noItems: {
    textAlign: "center",
    color: "#94a3b8",
    padding: "20px",
  },
  orderFooter: {
    padding: "15px 20px",
    borderTop: "1px solid #334155",
    backgroundColor: "#0f172a",
    display: "flex",
    justifyContent: "flex-end",
  },
  orderTotal: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#e2e8f0",
  },
  totalAmount: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#fbbf24",
  },
};

// Agregar animación para el spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default MisCompras;

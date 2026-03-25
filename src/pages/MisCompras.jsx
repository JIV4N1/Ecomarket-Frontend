// src/pages/MisCompras.jsx
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function MisCompras() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const obtenerOrdenes = async () => {
      try {
        const token = localStorage.getItem("token");
        const respuesta = await axios.get(
          "http://localhost:4000/api/orders/mis-compras",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOrdenes(respuesta.data.data || respuesta.data.ordenes || []);
      } catch (error) {
        console.error("Error al obtener órdenes:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerOrdenes();
  }, []);

  if (cargando) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Mis Compras</h2>
        <p style={styles.loading}>Cargando tu historial de compras...</p>
      </div>
    );
  }

  if (ordenes.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Mis Compras</h2>
        <div style={styles.emptyCard}>
          <p style={styles.emptyText}>Aún no has realizado ninguna compra.</p>
          <button
            style={styles.shopButton}
            onClick={() => (window.location.href = "/")}
          >
            Ir al Catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mis Compras</h2>
      <div style={styles.ordersList}>
        {ordenes.map((orden) => (
          <div key={orden.id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <h3 style={styles.orderNumber}>Orden #{orden.id}</h3>
              <p style={styles.orderDate}>
                {new Date(
                  orden.fecha_creacion || orden.createdAt,
                ).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div style={styles.orderItems}>
              {orden.items &&
                orden.items.map((item, index) => (
                  <div key={index} style={styles.orderItem}>
                    <span style={styles.itemName}>
                      {item.cantidad}x{" "}
                      {item.producto_nombre ||
                        item.Producto?.nombre ||
                        item.nombre}
                    </span>
                    <span style={styles.itemPrice}>
                      $
                      {(
                        (item.precio || item.precio_unitario || 0) *
                        (item.cantidad || 1)
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
            </div>
            <div style={styles.orderFooter}>
              <strong style={styles.orderTotal}>
                Total: ${(orden.total || 0).toFixed(2)}
              </strong>
              <span style={styles.orderStatus}>Pagado ✓</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  },
  title: {
    color: "#3b82f6",
    textAlign: "center",
    marginBottom: "30px",
  },
  loading: {
    textAlign: "center",
    color: "#94a3b8",
  },
  emptyCard: {
    backgroundColor: "#1e293b",
    padding: "40px",
    borderRadius: "8px",
    textAlign: "center",
  },
  emptyText: {
    color: "#94a3b8",
    marginBottom: "20px",
  },
  shopButton: {
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  ordersList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  orderCard: {
    backgroundColor: "#1e293b",
    borderRadius: "8px",
    padding: "20px",
    border: "1px solid #334155",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    paddingBottom: "10px",
    borderBottom: "1px solid #334155",
  },
  orderNumber: {
    color: "#3b82f6",
    margin: 0,
  },
  orderDate: {
    color: "#94a3b8",
    fontSize: "0.9rem",
  },
  orderItems: {
    marginBottom: "15px",
  },
  orderItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    color: "#e2e8f0",
  },
  itemName: {
    fontWeight: "normal",
  },
  itemPrice: {
    fontWeight: "bold",
    color: "#3b82f6",
  },
  orderFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "10px",
    borderTop: "1px solid #334155",
  },
  orderTotal: {
    fontSize: "1.1rem",
    color: "#fbbf24",
  },
  orderStatus: {
    color: "#10b981",
    fontWeight: "bold",
  },
};

export default MisCompras;

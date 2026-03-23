import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Cart() {
  const { cart, clearCart, totalCarrito } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      alert("Debes iniciar sesión para comprar");
      navigate("/login");
      return;
    }
    if (cart.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    setProcesando(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        items: cart.map((item) => ({
          productId: item.id,
          cantidad: item.cantidad,
        })),
      };

      const respuesta = await axios.post(
        "http://localhost:4000/api/orders",
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (respuesta.data.success) {
        alert(
          `¡Compra exitosa! Tu número de orden es: ${respuesta.data.orderId}`,
        );
        clearCart();
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      alert(
        "Error procesando la compra: " +
          (error.response?.data?.error || "Error de servidor"),
      );
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#1e293b",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h2
        style={{
          color: "#3b82f6",
          borderBottom: "1px solid #334155",
          paddingBottom: "10px",
        }}
      >
        Tu Carrito
      </h2>

      {cart.length === 0 ? (
        <p>No hay productos en tu carrito.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cart.map((item, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: "1px solid #334155",
                }}
              >
                <span>
                  {item.nombre} (x{item.cantidad})
                </span>
                <strong>${item.precio * item.cantidad}</strong>
              </li>
            ))}
          </ul>
          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <h3>Total: ${totalCarrito.toFixed(2)}</h3>
            <button
              onClick={handleCheckout}
              disabled={procesando}
              style={{
                padding: "15px 30px",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: procesando ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              {procesando ? "Procesando..." : "Pagar Ahora"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;

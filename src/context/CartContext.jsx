import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Añadir producto al carrito
  const addToCart = (producto) => {
    setCart((carritoActual) => {
      const existe = carritoActual.find((item) => item.id === producto.id);
      if (existe) {
        return carritoActual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      } else {
        return [...carritoActual, { ...producto, cantidad: 1 }];
      }
    });
    alert(`${producto.nombre} añadido al carrito`);
  };

  // Vaciar carrito
  const clearCart = () => setCart([]);

  // Total a pagar
  const totalCarrito = cart.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0,
  );

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, totalCarrito }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;

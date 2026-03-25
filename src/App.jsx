import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Perfil from "./pages/Perfil";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import MisCompras from "./pages/MisCompras";

function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          backgroundColor: "#0f172a",
          minHeight: "100vh",
          color: "white",
        }}
      >
        <Navbar />
        <main style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Perfil />
                </ProtectedRoute>
              }
            />
            <Route
              path="/carrito"
              element={
                <ProtectedRoute requireNormalUser={true}>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mis-compras"
              element={
                <ProtectedRoute requireNormalUser={true}>
                  <MisCompras />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

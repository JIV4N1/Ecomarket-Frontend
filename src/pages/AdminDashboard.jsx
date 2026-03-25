import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [procesando, setProcesando] = useState(false);

  // Cargar categorías al montar el componente
  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const respuesta = await axios.get(
          "http://localhost:4000/api/categories",
        );
        setCategorias(respuesta.data.data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    obtenerCategorias();
  }, []);

  // Si no es admin, redirige
  if (!user || user.role !== "admin") {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2 style={{ color: "#ef4444" }}>Acceso denegado</h2>
        <p>Solo los administradores pueden ver esta página.</p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcesando(true);
    setMensaje("");

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("precio", precio);
      formData.append("stock", stock);
      formData.append("CategoryId", categoriaId);
      if (imagen) formData.append("imagen", imagen);

      const respuesta = await axios.post(
        "http://localhost:4000/api/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (respuesta.data.success) {
        setMensaje("✅ Producto creado exitosamente");
        setNombre("");
        setPrecio("");
        setStock("");
        setCategoriaId("");
        setImagen(null);
        document.getElementById("inputImagen").value = "";
      }
    } catch (error) {
      setMensaje(
        "❌ Error: " + (error.response?.data?.error || "Error de servidor"),
      );
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2
          style={{
            textAlign: "center",
            color: "#3b82f6",
            marginBottom: "20px",
          }}
        >
          Panel de Administración
        </h2>
        <h3 style={{ color: "#94a3b8", marginBottom: "20px" }}>
          Agregar Nuevo Producto
        </h3>

        {mensaje && (
          <p
            style={{
              padding: "10px",
              borderRadius: "4px",
              backgroundColor: mensaje.includes("✅") ? "#064e3b" : "#7f1d1d",
              marginBottom: "15px",
            }}
          >
            {mensaje}
          </p>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Laptop Gamer"
            style={styles.input}
            required
          />

          <label>Precio</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="Ej: 15000"
            style={styles.input}
            required
          />

          <label>Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Ej: 10"
            style={styles.input}
            required
          />

          <label>Categoría</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            style={styles.input}
            required
          >
            <option value="">-- Selecciona una categoría --</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>

          <label>Imagen del producto</label>
          <input
            id="inputImagen"
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
            style={{ ...styles.input, padding: "8px" }}
          />

          <button
            type="submit"
            disabled={procesando}
            style={{
              ...styles.button,
              backgroundColor: procesando ? "#475569" : "#10b981",
              cursor: procesando ? "not-allowed" : "pointer",
            }}
          >
            {procesando ? "Guardando..." : "Crear Producto"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", padding: "30px" },
  card: {
    backgroundColor: "#1e293b",
    padding: "30px",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "500px",
    border: "1px solid #334155",
  },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #475569",
    backgroundColor: "#0f172a",
    color: "white",
  },
  button: {
    padding: "12px",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "1rem",
  },
};

export default AdminDashboard;

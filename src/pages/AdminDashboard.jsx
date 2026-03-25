// src/pages/AdminDashboard.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

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
        const token = localStorage.getItem("token");
        console.log("Token para categorías:", token);

        const respuesta = await axios.get(
          "http://localhost:4000/api/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("Respuesta completa de categorías:", respuesta);
        console.log("Datos de categorías:", respuesta.data);

        // Manejar diferentes estructuras de respuesta
        let categoriasData = [];
        if (respuesta.data.data && Array.isArray(respuesta.data.data)) {
          categoriasData = respuesta.data.data;
        } else if (Array.isArray(respuesta.data)) {
          categoriasData = respuesta.data;
        } else if (
          respuesta.data.categories &&
          Array.isArray(respuesta.data.categories)
        ) {
          categoriasData = respuesta.data.categories;
        }

        console.log("Categorías procesadas:", categoriasData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        console.error("Detalle del error:", error.response?.data);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las categorías",
        });
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

    // Validaciones
    if (!nombre.trim()) {
      setMensaje(" El nombre es obligatorio");
      setProcesando(false);
      return;
    }

    if (!precio || parseFloat(precio) <= 0) {
      setMensaje(" El precio debe ser mayor a 0");
      setProcesando(false);
      return;
    }

    if (!stock || parseInt(stock) < 0) {
      setMensaje(" El stock no puede ser negativo");
      setProcesando(false);
      return;
    }

    if (!categoriaId) {
      setMensaje(" Debes seleccionar una categoría");
      setProcesando(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token usado:", token);

      if (!token) {
        setMensaje(" No hay token de autenticación");
        setProcesando(false);
        return;
      }

      const formData = new FormData();
      formData.append("nombre", nombre.trim());
      formData.append("precio", parseFloat(precio));
      formData.append("stock", parseInt(stock));
      formData.append("categoryId", parseInt(categoriaId)); // Solo este campo, no duplicar

      if (imagen) {
        formData.append("imagen", imagen);
        console.log(
          "Imagen seleccionada:",
          imagen.name,
          imagen.size,
          imagen.type,
        );
      }

      // Depuración: mostrar qué se está enviando
      console.log("=== ENVIANDO PRODUCTO ===");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ":", pair[1]);
      }

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

      console.log("=== RESPUESTA DEL SERVIDOR ===");
      console.log("Status:", respuesta.status);
      console.log("Data completa:", respuesta.data);

      // CORRECCIÓN: El servidor devuelve el producto directamente
      // No espera respuesta.data.producto o respuesta.data.data
      if (respuesta.status === 200 || respuesta.status === 201) {
        const productoCreado = respuesta.data; // Directamente los datos del producto

        console.log("✅ Producto creado exitosamente:", productoCreado);

        Swal.fire({
          icon: "success",
          title: "¡Producto creado!",
          html: `
          <div style="text-align: left">
            <p><strong>Producto:</strong> ${productoCreado.nombre}</p>
            <p><strong>Precio:</strong> $${productoCreado.precio}</p>
            <p><strong>Stock:</strong> ${productoCreado.stock}</p>
            <p><strong>ID:</strong> ${productoCreado.id}</p>
          </div>
        `,
          confirmButtonColor: "#3b82f6",
        });

        // Limpiar formulario
        setNombre("");
        setPrecio("");
        setStock("");
        setCategoriaId("");
        setImagen(null);

        // Limpiar input file
        const fileInput = document.getElementById("inputImagen");
        if (fileInput) fileInput.value = "";

        setMensaje(
          ` Producto "${nombre}" creado exitosamente con ID ${productoCreado.id}!`,
        );

        // Opcional: Emitir evento para actualizar el catálogo
        // Puedes recargar la página o usar un estado global
        setTimeout(() => {
          // Recargar productos en el catálogo
          window.dispatchEvent(new Event("productoCreado"));
        }, 500);
      } else {
        setMensaje(" Error: " + (respuesta.data.error || "Error desconocido"));
      }
    } catch (error) {
      console.error("=== ERROR COMPLETO ===");
      console.error("Error:", error);

      let errorMsg = "Error de conexión con el servidor";

      if (error.response) {
        console.error("Response data:", error.response.data);
        errorMsg =
          error.response.data?.error ||
          error.response.data?.message ||
          `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMsg =
          "No se pudo conectar con el servidor. ¿El backend está corriendo?";
      } else {
        errorMsg = error.message;
      }

      setMensaje(` Error: ${errorMsg}`);

      Swal.fire({
        icon: "error",
        title: "Error al crear producto",
        text: errorMsg,
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Panel de Administración</h2>
        <h3 style={styles.subtitle}>Agregar Nuevo Producto</h3>

        {mensaje && (
          <p
            style={{
              ...styles.message,
              backgroundColor: mensaje.includes("✅")
                ? "#064e3b"
                : mensaje.includes("⚠️")
                  ? "#854d0e"
                  : "#7f1d1d",
            }}
          >
            {mensaje}
          </p>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nombre del producto *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Laptop Gamer"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Precio *</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="Ej: 15000"
              style={styles.input}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Stock *</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Ej: 10"
              style={styles.input}
              min="0"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Categoría *</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              style={styles.input}
              required
            >
              <option value="">-- Selecciona una categoría --</option>
              {categorias.length === 0 ? (
                <option disabled>Cargando categorías...</option>
              ) : (
                categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre} (ID: {cat.id})
                  </option>
                ))
              )}
            </select>
            {categorias.length === 0 && (
              <p style={styles.warning}>
                No hay categorías disponibles.
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  style={styles.reloadButton}
                >
                  Reintentar
                </button>
              </p>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Imagen del producto</label>
            <input
              id="inputImagen"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                console.log("Archivo seleccionado:", file);
                setImagen(file);
              }}
              style={styles.fileInput}
            />
            {imagen && (
              <p style={styles.fileInfo}>
                Archivo seleccionado: {imagen.name} (
                {(imagen.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={procesando || categorias.length === 0}
            style={{
              ...styles.button,
              backgroundColor:
                procesando || categorias.length === 0 ? "#475569" : "#10b981",
              cursor:
                procesando || categorias.length === 0
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {procesando ? "Guardando..." : "Crear Producto"}
          </button>
        </form>

        {/* Botón para verificar conexión */}
        <button
          type="button"
          onClick={async () => {
            try {
              const token = localStorage.getItem("token");
              const response = await axios.get(
                "http://localhost:4000/api/products",
                {
                  headers: { Authorization: `Bearer ${token}` },
                },
              );
              console.log("Productos actuales:", response.data);
              Swal.fire({
                icon: "info",
                title: "Conexión OK",
                text: `Hay ${response.data.data?.length || 0} productos en la base de datos`,
              });
            } catch (err) {
              console.error(err);
              Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "No se pudo conectar con el backend",
              });
            }
          }}
          style={styles.testButton}
        >
          Verificar conexión con el backend
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "30px",
    minHeight: "100vh",
    backgroundColor: "#0f172a",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: "30px",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "500px",
    border: "1px solid #334155",
  },
  title: {
    textAlign: "center",
    color: "#3b82f6",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    color: "#e2e8f0",
    fontSize: "0.9rem",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #475569",
    backgroundColor: "#0f172a",
    color: "white",
    fontSize: "1rem",
  },
  fileInput: {
    padding: "8px",
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
    marginTop: "10px",
    transition: "background-color 0.2s",
  },
  testButton: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  message: {
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
    textAlign: "center",
  },
  warning: {
    color: "#f59e0b",
    fontSize: "0.8rem",
    marginTop: "5px",
  },
  fileInfo: {
    color: "#3b82f6",
    fontSize: "0.8rem",
    marginTop: "5px",
  },
  reloadButton: {
    marginLeft: "10px",
    padding: "2px 8px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
};

export default AdminDashboard;

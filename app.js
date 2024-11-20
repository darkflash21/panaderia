const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Middleware
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a la base de datos
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "21122007",
  database: "panaderia",
});

con.connect((err) => {
  if (err) console.error("Error al conectar a la base de datos:", err);
  else console.log("Conexión a la base de datos establecida.");
});

// Endpoints
// Crear nuevo producto
app.post("/productos", upload.single("imagen"), (req, res) => {
  const { id_producto, nombre, categoria, precio, stock, descripcion } = req.body;
  const imagen = req.file ? req.file.filename : null;

  if (!id_producto || !nombre || !categoria || isNaN(precio) || isNaN(stock)) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  const sql = "INSERT INTO productos (id_producto, nombre, categoria, precio, stock, descripcion, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)";
  con.query(sql, [id_producto, nombre, categoria, parseFloat(precio), parseInt(stock, 10), descripcion, imagen], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      id_producto: id_producto,
      nombre,
      categoria,
      precio,
      stock,
      descripcion,
      imagen: imagen ? `/uploads/${imagen}` : null,
    });
  });
});

// Obtener todos los productos
app.get("/productos", (req, res) => {
  con.query("SELECT * FROM productos", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(
      results.map((p) => ({
        ...p,
        imagen: p.imagen ? `/uploads/${p.imagen}` : null,
      }))
    );
  });
});

// Obtener un producto específico por su id_producto
app.get("/productos/:id_producto", (req, res) => {
  const { id_producto } = req.params;
  con.query("SELECT * FROM productos WHERE id_producto = ?", [id_producto], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
    const product = results[0];
    res.json({
      id_producto: product.id_producto,
      nombre: product.nombre,
      categoria: product.categoria,
      precio: product.precio,
      stock: product.stock,
      descripcion: product.descripcion,
      imagen: product.imagen ? `/uploads/${product.imagen}` : null,
    });
  });
});

// Actualizar un producto
app.put("/productos/:id_producto", upload.single("imagen"), (req, res) => {
  const { id_producto } = req.params;
  const { nombre, categoria, precio, stock, descripcion } = req.body;
  const imagen = req.file ? req.file.filename : null;

  if (!nombre || !categoria || isNaN(precio) || isNaN(stock)) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  let updateQuery = "UPDATE productos SET nombre = ?, categoria = ?, precio = ?, stock = ?, descripcion = ? WHERE id_producto = ?";
  let updateValues = [nombre, categoria, parseFloat(precio), parseInt(stock, 10), descripcion, id_producto];

  if (imagen) {
    updateQuery = "UPDATE productos SET nombre = ?, categoria = ?, precio = ?, stock = ?, descripcion = ?, imagen = ? WHERE id_producto = ?";
    updateValues.push(imagen);
  }

  con.query(updateQuery, updateValues, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      id_producto,
      nombre,
      categoria,
      precio,
      stock,
      descripcion,
      imagen: imagen ? `/uploads/${imagen}` : null,
    });
  });
});

// Eliminar un producto
app.delete("/productos/:id_producto", (req, res) => {
  const { id_producto } = req.params;

  con.query("SELECT imagen FROM productos WHERE id_producto = ?", [id_producto], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const imagen = results[0]?.imagen;
    if (imagen) {
      fs.unlink(path.join(__dirname, "uploads", path.basename(imagen)), (err) => {
        if (err) console.error("Error al eliminar la imagen:", err);
      });
    }

    con.query("DELETE FROM productos WHERE id_producto = ?", [id_producto], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Producto eliminado con éxito" });
    });
  });
});

app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));

require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

// Configuración de la base de datos
const connection = mysql.createConnection({
  host: 'localhost',      // 'localhost'
  user: 'root',      // 'root'
  password: 'n0m3l0', // '21122007'
  database: 'panaderia_desesperanza'    // 'panaderia_desesperanza'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Termina el proceso si no puede conectar a la DB
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

console.log('Conectando a la base de datos con los siguientes datos:');
console.log('Host:', process.env.DB_HOST);
console.log('Usuario:', process.env.DB_USER);
console.log('Base de datos:', process.env.DB_NAME);

// Crear una instancia de la aplicación Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware para procesar JSON
app.use(express.json());

// Rutas para los productos
app.get('/productos', (req, res) => {
  connection.query('SELECT * FROM productos', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener productos' });
    }
    res.json(results);
  });
});

app.post('/productos', (req, res) => {
  const { nombre, categoria, precio, stock, descripcion, imagen_url } = req.body;
  if (!nombre || !precio || !stock) {
    return res.status(400).json({ error: 'Datos del producto incompletos' });
  }

  const query = 'INSERT INTO productos (nombre, categoria, precio, stock, descripcion, imagen_url) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [nombre, categoria, precio, stock, descripcion, imagen_url];
  
  connection.query(query, values, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al crear producto' });
    }
    res.status(201).json({ message: 'Producto creado exitosamente' });
  });
});

app.put('/productos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, categoria, precio, stock, descripcion, imagen_url } = req.body;
  const query = 'UPDATE productos SET nombre = ?, categoria = ?, precio = ?, stock = ?, descripcion = ?, imagen_url = ? WHERE id_producto = ?';
  const values = [nombre, categoria, precio, stock, descripcion, imagen_url, id];
  
  connection.query(query, values, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar producto' });
    }
    res.json({ message: 'Producto actualizado exitosamente' });
  });
});

app.delete('/productos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM productos WHERE id_producto = ?';

  connection.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar producto' });
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  });
});

// Ruta para servir el archivo `index.html` cuando accedes a la raíz
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Middleware de gestión de errores
app.use((err, req, res, next) => {
  console.error('Error interno del servidor:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

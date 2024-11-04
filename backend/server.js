const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '21122007',
  database: 'tu_base_de_datos'
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
    return;
  }
  console.log('Conexión exitosa a la base de datos.');
});
app.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) {
      console.error('Error al obtener productos:', err.message);
      return res.status(500).json({ error: 'Error al obtener productos' });
    }
    res.status(200).json(results);
  });
});
app.post('/productos', (req, res) => {
  const { nombre, categoria, precio, stock, descripcion } = req.body;

  // Validación simple
  if (!nombre || !categoria || !precio || !stock || !descripcion) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = 'INSERT INTO productos (nombre, categoria, precio, stock, descripcion) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nombre, categoria, precio, stock, descripcion], (err, results) => {
    if (err) {
      console.error('Error al crear producto:', err.message);
      return res.status(500).json({ error: 'Error al crear producto' });
    }
    res.status(201).json({ message: 'Producto creado con éxito', productoId: results.insertId });
  });
});



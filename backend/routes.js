// routes.js
const express = require('express');
const router = express.Router();
const connection = require('./db');

// Obtener todos los productos
router.get('/', (req, res) => {
  connection.query('SELECT * FROM productos', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener productos' });
    }
    res.json(results);
  });
});

// Crear un nuevo producto
router.post('/', (req, res) => {
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

// Actualizar un producto
router.put('/:id', (req, res) => {
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

// Eliminar un producto
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM productos WHERE id_producto = ?';

  connection.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar producto' });
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  });
});

module.exports = router;

require('dotenv').config();
const express = require('express');
const db = require('./db'); // Importa la conexión a la base de datos desde db.js
const productosRoutes = require('./routes'); // Importa las rutas desde routes.js

const app = express();
const port = process.env.PORT || 3000;

// Middleware para procesar JSON
app.use(express.json());

// Configura la carpeta de archivos estáticos para que pueda servir `index.html`
app.use(express.static('public'));

// Verificación de conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
    process.exit(1); // Finaliza el proceso si la base de datos no conecta
  }
  console.log('Conexión exitosa a la base de datos.');
});

// Usa las rutas definidas en routes.js
app.use('/productos', productosRoutes);

// Ruta para servir `index.html` cuando accedes a la raíz del servidor
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

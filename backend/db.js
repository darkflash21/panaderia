require('dotenv').config();
console.log(process.env);
const mysql = require('mysql2');


const connection = mysql.createConnection({
  host: process.env.DB_HOST,      // 'localhost'
  user: process.env.DB_USER,      // 'root'
  password: process.env.DB_PASSWORD, // '21122007'
  database: process.env.DB_NAME    // 'panaderia_desesperanza'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

module.exports = connection;
console.log('Conectando a la base de datos con los siguientes datos:');
console.log('Host:', process.env.DB_HOST);
console.log('Usuario:', process.env.DB_USER);
console.log('Base de datos:', process.env.DB_NAME);


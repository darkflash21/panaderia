CREATE DATABASE panaderia_desesperanza;
USE panaderia_desesperanza;
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255)
);

);
CREATE TABLE Inventario (
    id_producto INT NOT NULL,
    fecha DATE NOT NULL,
    cantidad_agregada INT NOT NULL,
    cantidad_total INT NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);
CREATE TABLE Clientes (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(150),
    telefono VARCHAR(20),
    email VARCHAR(100)
);
CREATE TABLE Pedidos (
    id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    fecha DATE NOT NULL,
    estado VARCHAR(50) NOT NULL,
    monto_total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente)
);
CREATE TABLE Factura (
    id_factura INT PRIMARY KEY AUTO_INCREMENT,
    id_pedido INT NOT NULL,
    fecha DATE NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido)
);
SELECT * FROM productos;



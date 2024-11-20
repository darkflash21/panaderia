document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("productForm");
  const inventoryTable = document.querySelector(".inventory-table tbody");
  const API_URL = "/productos";

  // Cargar productos al inicializar la página
  fetch(API_URL)
    .then((response) => response.json())
    .then((products) => {
      products.forEach((product) => addProductRow(product));
    })
    .catch((error) => {
      console.error("Error al cargar productos:", error);
      alert("Error al cargar productos. Intenta nuevamente.");
    });

  // Manejo del formulario
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(productForm);
    const productId = formData.get("id_producto");

    const productData = {
      id_producto: parseInt(productId, 10),
      nombre: formData.get("nombre"),
      categoria: formData.get("categoria"),
      precio: parseFloat(formData.get("precio")),
      stock: parseInt(formData.get("stock"), 10),
      descripcion: formData.get("descripcion"),
    };

    const method = productId ? "PUT" : "POST";
    const url = productId ? `${API_URL}/${productId}` : API_URL;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Error en ${method} producto`);
        return response.json();
      })
      .then((product) => {
        if (method === "POST") addProductRow(product);
        else updateProductRow(product);

        alert(`Producto ${method === "POST" ? "agregado" : "actualizado"} con éxito.`);
        closeModal();
      })
      .catch((error) => {
        console.error(`Error al ${method === "POST" ? "agregar" : "editar"} producto:`, error);
        alert(`Error al ${method === "POST" ? "agregar" : "editar"} producto.`);
      });
  });

  // Eliminar producto
  window.deleteProduct = () => {
    const productId = prompt("Ingresa el ID del producto a eliminar:");
    if (!productId) return;

    fetch(`${API_URL}/${productId}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error("Error al eliminar producto");
        const row = inventoryTable.querySelector(`tr[data-id='${productId}']`);
        if (row) row.remove();
        alert("Producto eliminado con éxito.");
      })
      .catch((error) => {
        console.error("Error al eliminar producto:", error);
        alert("Error al eliminar producto. Intenta nuevamente.");
      });
  };

  // Actualizar una fila
  function updateProductRow(product) {
    const row = inventoryTable.querySelector(`tr[data-id='${product.id_producto}']`);
    if (!row) return;

    row.children[1].textContent = product.nombre || "Sin nombre";
    row.children[2].textContent = product.categoria || "Sin categoría";
    row.children[3].textContent = `$${parseFloat(product.precio).toFixed(2)}`;
    row.children[4].textContent = product.stock || "0";
    row.children[5].textContent = product.descripcion || "Sin descripción";
  }

  // Agregar una fila
  function addProductRow(product) {
    const row = document.createElement("tr");
    row.setAttribute("data-id", product.id_producto);

    row.innerHTML = `
      <td>${product.id_producto}</td>
      <td>${product.nombre || "Sin nombre"}</td>
      <td>${product.categoria || "Sin categoría"}</td>
      <td>$${parseFloat(product.precio || 0).toFixed(2)}</td>
      <td>${product.stock || "0"}</td>
      <td>${product.descripcion || "Sin descripción"}</td>
      <td>
        ${
          product.imagen
            ? `<img src="${product.imagen}" alt="${product.nombre}" class="product-image">`
            : "Sin imagen"
        }
      </td>`;
    inventoryTable.appendChild(row);
  }
});

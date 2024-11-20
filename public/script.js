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

  // Variables para los botones y modal
  const addProductBtn = document.getElementById('addProductBtn');
  const editProductBtn = document.getElementById('editProductBtn');
  const deleteProductBtn = document.getElementById('deleteProductBtn');
  const productModal = document.getElementById('productModal');
  const closeModalBtn = document.getElementById('closeModal');

  // Función para abrir el modal
  function openModal() {
    productModal.style.display = 'block';
  }

  // Función para cerrar el modal
  function closeModal() {
    productModal.style.display = 'none';
  }

  // Manejo del formulario de agregar o editar producto
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

  // Abre el modal cuando se hace clic en "Agregar un nuevo producto"
  addProductBtn.addEventListener('click', () => {
    productForm.reset();
    document.getElementById('modalTitle').innerText = 'Agregar Producto';
    openModal();
  });

  // Cerrar el modal cuando se hace clic en la "X"
  closeModalBtn.addEventListener('click', closeModal);

  // Abre el modal para editar un producto cuando se hace clic en "Editar producto"
  editProductBtn.addEventListener('click', () => {
    const productId = prompt("Ingresa el ID del producto que deseas editar:");
    
    // Verificar si el ID es válido (es un número positivo)
    if (!productId || isNaN(productId) || parseInt(productId, 10) <= 0) {
      alert("Por favor, ingresa un ID de producto válido.");
      return;
    }
  
    // Realizar una solicitud para obtener el producto con ese ID
    fetch(`${API_URL}/${productId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Producto no encontrado.");
        }
        return response.json();
      })
      .then((selectedProduct) => {
        // Llenar el formulario con la información del producto seleccionado
        document.getElementById('productId').value = selectedProduct.id_producto;
        document.getElementById('nombreProducto').value = selectedProduct.nombre;
        document.getElementById('productCategory').value = selectedProduct.categoria;
        document.getElementById('productPrice').value = selectedProduct.precio;
        document.getElementById('productQuantity').value = selectedProduct.stock;
        document.getElementById('productDescription').value = selectedProduct.descripcion;
        document.getElementById('productImage').value = selectedProduct.imagen;
  
        // Cambiar el título del modal y abrirlo
        document.getElementById('modalTitle').innerText = 'Editar Producto';
        openModal();
      })
      .catch((error) => {
        console.error("Error al obtener el producto:", error);
        alert("Producto no encontrado o ocurrió un error al intentar cargarlo.");
      });
  });
  

  // Función para eliminar un producto
  const deleteProduct = () => {
    const productId = prompt("Ingresa el ID del producto a eliminar:");
    if (!productId || isNaN(productId)) {
      alert("ID de producto inválido.");
      return;
    }

    fetch(`${API_URL}/${productId}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error(`Error al eliminar producto: ${response.statusText}`);
        const row = inventoryTable.querySelector(`tr[data-id='${productId}']`);
        if (row) row.remove();
        alert("Producto eliminado con éxito.");
      })
      .catch((error) => {
        console.error("Error al eliminar producto:", error);
        alert("Error al eliminar producto. Intenta nuevamente.");
      });
  };

  // Eliminar producto cuando se hace clic en el botón correspondiente
  deleteProductBtn.addEventListener('click', deleteProduct);

  // Actualizar una fila en la tabla de inventario
  function updateProductRow(product) {
    const productId = prompt("Ingresa el ID del producto a editar:");
    if (!row) return;

    row.children[1].textContent = product.nombre || "Sin nombre";
    row.children[2].textContent = product.categoria || "Sin categoría";
    row.children[3].textContent = `$${parseFloat(product.precio).toFixed(2)}`;
    row.children[4].textContent = product.stock || "0";
    row.children[5].textContent = product.descripcion || "Sin descripción";
  }
  return selectedProduct;

  // Agregar una fila al inventario
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
        ${product.imagen ? `<img src="${product.imagen}" alt="${product.nombre}" class="product-image">` : "Sin imagen"}
      </td>`;
    inventoryTable.appendChild(row);
  }

  // Función para obtener el producto seleccionado
  function getSelectedProduct() {
    const selectedRow = inventoryTable.querySelector('tr.selected');
    if (!selectedRow) return null;
    const productId = selectedRow.getAttribute('data-id');
    return {
      id: productId,
      nombre: selectedRow.children[1].textContent,
      categoria: selectedRow.children[2].textContent,
      precio: parseFloat(selectedRow.children[3].textContent.replace('$', '')),
      stock: parseInt(selectedRow.children[4].textContent, 10),
      descripcion: selectedRow.children[5].textContent,
      imagen: selectedRow.children[6].textContent.trim() !== "Sin imagen" ? selectedRow.children[6].querySelector('img').src : null
    };
  }
});

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
  
    // Variables para los elementos del DOM
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
  
  // Abre el modal cuando se hace clic en "Agregar un nuevo producto"
  addProductBtn.addEventListener('click', () => {
    // Limpiar el formulario para agregar un nuevo producto
    productForm.reset();
    document.getElementById('modalTitle').innerText = 'Agregar Producto';
    openModal();
  });
  
  // Cerrar el modal cuando se hace clic en la "X"
  closeModalBtn.addEventListener('click', closeModal);
  
  // Abre el modal para editar un producto cuando se hace clic en "Editar producto"
  editProductBtn.addEventListener('click', () => {
    const selectedProduct = getSelectedProduct();
    if (selectedProduct) {
      // Llenar el formulario con la información del producto seleccionado
      document.getElementById('productId').value = selectedProduct.id;
      document.getElementById('nombreProducto').value = selectedProduct.nombre;
      document.getElementById('productCategory').value = selectedProduct.categoria;
      document.getElementById('productPrice').value = selectedProduct.precio;
      document.getElementById('productQuantity').value = selectedProduct.stock;
      document.getElementById('productDescription').value = selectedProduct.descripcion;
      document.getElementById('productImage').value = selectedProduct.imagen;
  
      document.getElementById('modalTitle').innerText = 'Editar Producto';
      openModal();
    } else {
      alert("Selecciona un producto para editar.");
    }
  });
  
  // Eliminar el producto seleccionado cuando se hace clic en "Eliminar producto"
  deleteProductBtn.addEventListener('click', () => {
    const selectedProduct = getSelectedProduct();
    if (selectedProduct) {
      const confirmation = confirm("¿Estás seguro de que quieres eliminar este producto?");
      if (confirmation) {
        // Aquí deberías implementar la lógica para eliminar el producto
        // Por ejemplo, eliminarlo de la tabla o hacer una solicitud para eliminarlo en el servidor
        deleteProduct(selectedProduct.id);
      }
    } else {
      alert("Selecciona un producto para eliminar.");
    }
  });
  
  // Función para obtener el producto seleccionado (puedes personalizarla según tu implementación)
  function getSelectedProduct() {
    // Este es un ejemplo donde seleccionas el primer producto en la tabla
    // En un caso real, deberías permitir al usuario seleccionar una fila para editar o eliminar.
    const rows = document.querySelectorAll('.inventory-table tbody tr');
    let selectedProduct = null;
    rows.forEach(row => {
      if (row.classList.contains('selected')) {
        // Aquí se debe extraer la información del producto de la fila seleccionada
        selectedProduct = {
          id: row.cells[0].textContent,
          nombre: row.cells[1].textContent,
          categoria: row.cells[2].textContent,
          precio: row.cells[3].textContent,
          stock: row.cells[4].textContent,
          descripcion: row.cells[5].textContent,
          imagen: row.cells[6].textContent // O manejar la imagen de otra manera
        };
      }
    });
    return selectedProduct;
  }
  
  // Función para eliminar el producto
  function deleteProduct(productId) {
    // Lógica para eliminar el producto (de la tabla o enviando una solicitud al servidor)
    const rows = document.querySelectorAll('.inventory-table tbody tr');
    rows.forEach(row => {
      if (row.cells[0].textContent == productId) {
        row.remove();
      }
    });
    alert('Producto eliminado');
  }
  
  // Opción para seleccionar un producto desde la tabla (esto sería un ejemplo de manejo de la tabla)
  document.querySelectorAll('.inventory-table tbody tr').forEach(row => {
    row.addEventListener('click', () => {
      row.classList.toggle('selected');
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("productModal");
  const productForm = document.getElementById("productForm");
  const inventoryTable = document.querySelector(".inventory-table tbody");
  const slides = document.querySelectorAll('.carousel-slide');
  const carouselImages = document.querySelector('.carousel-images');
  
  let currentProductRow = null;
  let currentSlideIndex = 0;

  // Función para cambiar de slide
  function changeSlide(direction) {
    // Remover la clase 'active' de la imagen actual
    slides[currentSlideIndex].classList.remove('active');

    // Actualizar el índice de la imagen actual
    currentSlideIndex = (currentSlideIndex + direction + slides.length) % slides.length;

    // Agregar la clase 'active' a la nueva imagen
    slides[currentSlideIndex].classList.add('active');

    // Mover el contenedor de las imágenes a la posición de la imagen actual
    carouselImages.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
  }

  // Inicializar el primer slide como activo
  if (slides.length > 0) {
    slides[0].classList.add('active');
  }

  // Asignar la función a los botones de control del carrusel
  document.querySelector('.prev').onclick = () => changeSlide(-1);
  document.querySelector('.next').onclick = () => changeSlide(1);

  // Abrir Modal de Edición
  window.openModal = (row) => {
    if (row) {
      currentProductRow = row;
      const [name, category, price, quantity] = row.children;
      
      document.getElementById("productName").value = name.textContent;
      document.getElementById("productCategory").value = category.textContent;
      document.getElementById("productPrice").value = parseFloat(price.textContent.replace('$', ''));
      document.getElementById("productQuantity").value = quantity.textContent;
    }
    modal.style.display = "block";
  };

  // Cerrar Modal de Edición
  window.closeModal = () => {
    modal.style.display = "none";
    productForm.reset();
    currentProductRow = null;
  };

  // Guardar Cambios en el Producto
  productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const updatedProduct = {
      name: document.getElementById("productName").value,
      category: document.getElementById("productCategory").value,
      price: parseFloat(document.getElementById("productPrice").value).toFixed(2),
      quantity: document.getElementById("productQuantity").value,
    };

    if (currentProductRow) {
      updateProductRow(currentProductRow, updatedProduct);
    } else {
      addProductRow(updatedProduct);
    }
    closeModal();
  });

  // Actualizar Fila de Producto Existente
  function updateProductRow(row, product) {
    row.children[0].textContent = product.name;
    row.children[1].textContent = product.category;
    row.children[2].textContent = `$${product.price}`;
    row.children[3].textContent = product.quantity;
  }

  // Agregar una Nueva Fila de Producto
  function addProductRow(product) {
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>$${product.price}</td>
      <td>${product.quantity}</td>
      <td>
        <button class="btn create-btn" onclick="openModal(this.parentElement.parentElement)">Agregar nuevo producto</button>
        <button class="btn delete-btn" onclick="deleteProductRow(this.parentElement.parentElement)">Eliminar</button>
      </td>
    `;

    inventoryTable.appendChild(newRow);
  }

  // Eliminar Fila de Producto
  window.deleteProductRow = (row) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      row.remove();
    }
  };

  // Cerrar el modal al hacer clic fuera de la ventana
  window.onclick = (event) => {
    if (event.target === modal) closeModal();
  };
});

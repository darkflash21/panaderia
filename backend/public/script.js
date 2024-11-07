document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("productForm");
  const inventoryTable = document.querySelector(".inventory-table tbody");
  let editingRow = null;

  productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const product = {
      name: document.getElementById("productName").value,
      category: document.getElementById("productCategory").value,
      price: parseFloat(document.getElementById("productPrice").value).toFixed(2),
      quantity: parseInt(document.getElementById("productQuantity").value, 10),
      description: document.getElementById("productDescription").value,
      image: document.getElementById("productImage").files[0] ? URL.createObjectURL(document.getElementById("productImage").files[0]) : null
    };

    if (editingRow) {
      updateProductRow(editingRow, product);
      editingRow = null;
    } else {
      addProductRow(product);
    }

    closeModal();
    productForm.reset();
  });

  function addProductRow(product) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>$${product.price}</td>
      <td>${product.quantity}</td>
      <td>${product.description}</td>
      <td>${product.image ? `<img src="${product.image}" alt="${product.name}" class="product-image">` : 'Sin imagen'}</td>
      <td>
        <button class="edit-btn" onclick="openModal(this.parentElement.parentElement)">Editar</button>
        <button class="delete-btn" onclick="deleteProductRow(this.parentElement.parentElement)">Eliminar</button>
      </td>`;
    inventoryTable.appendChild(row);
  }

  function updateProductRow(row, product) {
    const [name, category, price, quantity, description, imageCell] = row.children;
    name.textContent = product.name;
    category.textContent = product.category;
    price.textContent = `$${product.price}`;
    quantity.textContent = product.quantity;
    description.textContent = product.description;
    imageCell.innerHTML = product.image ? `<img src="${product.image}" alt="${product.name}" class="product-image">` : 'Sin imagen';
  }

  window.deleteProductRow = (row) => {
    row.remove();
  };

  window.openModal = (row = null) => {
    editingRow = row;
    if (row) {
      const [name, category, price, quantity, description] = row.children;
      document.getElementById("productName").value = name.textContent;
      document.getElementById("productCategory").value = category.textContent;
      document.getElementById("productPrice").value = price.textContent.replace('$', '');
      document.getElementById("productQuantity").value = quantity.textContent;
      document.getElementById("productDescription").value = description.textContent;
      document.getElementById("productImage").value = ''; // Reset file input
    }
    document.getElementById("productModal").style.display = "block";
  };

  window.closeModal = () => {
    document.getElementById("productModal").style.display = "none";
    productForm.reset();
  };
});

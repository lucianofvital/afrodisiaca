// Dados dos produtos por categoria
const products = {
  yaya: [
    {
      id: 1,
      name: "Pijama YAYA",
      price: 29.9,
      category: "yaya",
      sizes: ["P", "M", "G", "GG"],
      image: "assets/img/yaya01.jpg",
      description: "Pijama em cetim com detalhes em renda",
    },
  ],
  flora: [
    {
      id: 2,
      name: "Pijama Flora",
      price: 34.9,
      category: "flora",
      sizes: ["P", "M", "G", "GG"],
      image: "assets/img/flora01.jpg",
      description: "Pijama estampado com flores delicadas",
    },
  ],
  cigana: [
    {
      id: 3,
      name: "Langerie Cigana da Noite",
      price: 35.9,
      category: "cigana",
      sizes: ["P", "M", "G", "GG"],
      image: "assets/img/noitedacigana01.jpg",
      description: "Conjunto sensual com transparência",
    },
  ],
  afrodite: [
    {
      id: 4,
      name: "Langerie Afrodite",
      price: 31.9,
      category: "afrodite",
      sizes: ["P", "M", "G", "GG"],
      image: "assets/img/afrodite01.jpg",
      description: "Conjunto com renda premium",
    },
  ],
  cravo: [
    {
      id: 5,
      name: "Langerie Cravo e Canela",
      price: 27.9,
      category: "cravo",
      sizes: ["P", "M", "G"],
      image: "assets/img/cravoecanela01.jpg",
      description: "Conjunto romântico com bordados",
    },
  ],
};

// Estado global
let cart = [];
let currentCategory = "todos";

// Inicialização do site
document.addEventListener("DOMContentLoaded", () => {
  setupCarousel();
  setupCategoryListeners();
  renderProducts("todos");
  updateCartCount();
  renderCart();
});

// Configuração do carrossel
function setupCarousel() {
  const carousel = new bootstrap.Carousel(
    document.getElementById("promoCarousel"),
    {
      interval: 3000,
      touch: true,
      pause: "hover",
    }
  );

  document.querySelectorAll(".carousel-item img").forEach((img) => {
    img.style.transition = "opacity 0.3s ease";
  });
}

// Funções de Categoria
function setupCategoryListeners() {
  const categoryItems = document.querySelectorAll(".category-item");

  categoryItems.forEach((item) => {
    item.addEventListener("click", () => {
      categoryItems.forEach((cat) => cat.classList.remove("active"));
      item.classList.add("active");

      currentCategory = item.dataset.category;
      renderProducts(currentCategory);

      document.querySelector("#products-grid").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
}

// Funções de Produtos
function renderProducts(category) {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";

  let productsToShow = [];

  if (category === "todos") {
    Object.values(products).forEach((categoryProducts) => {
      productsToShow = productsToShow.concat(categoryProducts);
    });
  } else {
    productsToShow = products[category] || [];
  }

  productsToShow.forEach((product) => {
    const card = createProductCard(product);
    grid.appendChild(card);
  });
}

function createProductCard(product) {
  const div = document.createElement("div");
  div.className = "col-6 col-md-4 col-lg-3";
  div.innerHTML = `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" class="img-fluid">
        <div class="product-overlay">
          <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
            <i class="fas fa-shopping-bag"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="price">R$ ${product.price.toFixed(2)}</p>
        <div class="sizes">
          ${product.sizes
            .map(
              (size) =>
                `<button class="size-btn" onclick="selectSize(this, '${size}')">${size}</button>`
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
  return div;
}

// Funções do Carrinho
function addToCart(productId) {
  const product = findProductById(productId);
  const selectedSize =
    document.querySelector(".size-btn.selected")?.textContent;

  if (!selectedSize) {
    alert("Selecione um tamanho");
    return;
  }

  cart.push({
    ...product,
    size: selectedSize,
  });

  updateCartCount();
  renderCart();
  toggleCart();
}

function removeFromCart(productId) {
  const index = cart.findIndex((item) => item.id === productId);
  if (index > -1) {
    cart.splice(index, 1);
    updateCartCount();
    renderCart();
  }
}

function updateCartCount() {
  const counts = document.querySelectorAll(".cart-count");
  counts.forEach((count) => (count.textContent = cart.length));
}

function renderCart() {
  const cartItems = document.querySelector(".cart-items");
  const subtotalValue = document.querySelector(".subtotal-value");

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
    subtotalValue.textContent = "R$ 0,00";
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h6>${item.name}</h6>
        <p>Tamanho: ${item.size}</p>
        <p>R$ ${item.price.toFixed(2)}</p>
      </div>
      <button class="remove-item" onclick="removeFromCart(${item.id})">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  subtotalValue.textContent = `R$ ${total.toFixed(2)}`;
}

// Funções Utilitárias
function findProductById(id) {
  let foundProduct = null;
  Object.values(products).forEach((categoryProducts) => {
    const product = categoryProducts.find((p) => p.id === id);
    if (product) foundProduct = product;
  });
  return foundProduct;
}

function selectSize(btn, size) {
  btn
    .closest(".sizes")
    .querySelectorAll(".size-btn")
    .forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");
}

function toggleCart() {
  const cartDropdown = document.getElementById("cart-dropdown");
  cartDropdown.classList.toggle("active");

  if (window.innerWidth <= 768) {
    if (cartDropdown.classList.contains("active")) {
      const overlay = document.createElement("div");
      overlay.className = "cart-overlay";
      overlay.onclick = toggleCart;
      document.body.appendChild(overlay);
    } else {
      const overlay = document.querySelector(".cart-overlay");
      if (overlay) overlay.remove();
    }
  }
}

function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio");
    return;
  }

  const message = `Olá! Gostei desses produtos:\n${cart
    .map((item) => `- ${item.name}, tamanho ${item.size}`)
    .join("\n")}`;

  const url = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

// Atualizar a função createProductCard
function createProductCard(product) {
  const div = document.createElement("div");
  div.className = "col-6 col-md-4 col-lg-3";
  div.innerHTML = `
    <div class="product-card" onclick="openProductModal(${product.id})">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" class="img-fluid">
        <div class="product-overlay">
          <button class="quick-view-btn">
            <i class="fas fa-eye"></i>
            Ver detalhes
          </button>
        </div>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="price">R$ ${product.price.toFixed(2)}</p>
        <span class="installments">ou 3x de R$ ${(product.price / 3).toFixed(2)}</span>
      </div>
    </div>
  `;
  return div;
}

// Adicionar função para abrir o modal
function openProductModal(productId) {
  const product = findProductById(productId);
  const modal = new bootstrap.Modal(document.getElementById('productModal'));
  
  // Preencher informações do modal
  const modalEl = document.getElementById('productModal');
  modalEl.querySelector('.main-image').src = product.image;
  modalEl.querySelector('.main-image').alt = product.name;
  modalEl.querySelector('.category-tag').textContent = product.category.toUpperCase();
  modalEl.querySelector('.product-title').textContent = product.name;
  modalEl.querySelector('.price').textContent = `R$ ${product.price.toFixed(2)}`;
  modalEl.querySelector('.description').textContent = product.description;
  
  // Preencher seletores de tamanho
  const sizeButtons = modalEl.querySelector('.size-buttons');
  sizeButtons.innerHTML = product.sizes.map(size => `
    <button class="size-btn" onclick="selectSize(this, '${size}')">${size}</button>
  `).join('');
  
  // Configurar botão de adicionar ao carrinho
  const addButton = modalEl.querySelector('.add-to-cart-modal');
  addButton.onclick = () => {
    const selectedSize = modalEl.querySelector('.size-btn.selected')?.textContent;
    if (!selectedSize) {
      alert('Selecione um tamanho');
      return;
    }
    addToCart(productId);
    modal.hide();
  };
  
  // Configurar zoom da imagem
  const mainImage = modalEl.querySelector('.main-image');
  mainImage.onclick = function() {
    const zoomContainer = document.createElement('div');
    zoomContainer.className = 'zoomed';
    zoomContainer.innerHTML = `<img src="${product.image}" alt="${product.name}">`;
    document.body.appendChild(zoomContainer);
    
    zoomContainer.onclick = () => zoomContainer.remove();
  };
  
  modal.show();
}

function createProductCard(product) {
  const div = document.createElement("div");
  div.className = "col-6 col-md-4 col-lg-3";
  div.innerHTML = `
    <div class="product-card" onclick="openProductModal(${product.id})">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" class="img-fluid">
        <div class="product-overlay">
          <button class="quick-view-btn">
            <i class="fas fa-eye"></i>
            Ver detalhes
          </button>
        </div>
      </div>
      <div class="product-info">
        <span class="category-label">${product.category.toUpperCase()}</span>
        <h3>${product.name}</h3>
        <div class="product-price-wrap">
          <div class="price-block">
            ${product.originalPrice ? `
              <span class="original-price">R$ ${product.originalPrice.toFixed(2)}</span>
              <span class="discount">-${Math.round((1 - product.price/product.originalPrice) * 100)}%</span>
            ` : ''}
            <span class="price">R$ ${product.price.toFixed(2)}</span>
          </div>
          <span class="installments">ou 3x de R$ ${(product.price / 3).toFixed(2)} sem juros</span>
        </div>
        <div class="size-options">
          ${product.sizes.map(size => `
            <button class="size-btn" onclick="event.stopPropagation(); selectSize(this, '${size}')">${size}</button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  return div;
}
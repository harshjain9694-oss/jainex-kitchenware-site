
/* Jainex Kitchenware - Complete website script */

const WHATSAPP_NUMBER = "916375571735";

let products = [];
let cart = [];
let activeFilter = "all";

const grid = document.getElementById("productGrid");
const search = document.getElementById("searchInput");

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(Number(amount) || 0);

function whatsapp(message) {
  const url =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message);

  window.open(url, "_blank", "noopener");
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function categoryLabel(category) {
  const labels = {
    storage: "Storage & Stands",
    kitchenware: "Kitchenware",
    cookware: "Cookware",
    serveware: "Serveware",
    accessories: "Accessories"
  };

  return labels[category] || category || "Kitchenware";
}

function applySiteSettings(site) {
  if (!site || typeof site !== "object") return;

  const name = site.brandName || site.name || "Jainex Kitchenware";
  document.querySelectorAll("[data-site-name]").forEach((el) => {
    el.textContent = name;
  });

  document.querySelectorAll("[data-site-phone]").forEach((el) => {
    el.textContent = site.phone || "";
  });

  document.querySelectorAll("[data-site-email]").forEach((el) => {
    el.textContent = site.email || "";
  });

  document.querySelectorAll("[data-site-tagline]").forEach((el) => {
    el.textContent = site.tagline || "";
  });
}

function render() {
  if (!grid) return;

  const query = search ? search.value.trim().toLowerCase() : "";

  const visibleProducts = products.filter((product) => {
    const active = product.active !== false;
    const categoryMatches =
      activeFilter === "all" || product.category === activeFilter;

    const searchText = [
      product.name,
      product.category,
      product.description
    ].join(" ").toLowerCase();

    return active && categoryMatches && searchText.includes(query);
  });

  if (visibleProducts.length === 0) {
    grid.innerHTML =
      '<div class="empty">No products found. Try another search.</div>';
    return;
  }

  grid.innerHTML = visibleProducts.map((product) => {
    const id = escapeHTML(product.id);
    const name = escapeHTML(product.name || "Kitchenware Product");
    const category = escapeHTML(categoryLabel(product.category));
    const description = escapeHTML(product.description || "");
    const price = Number(product.price) || 0;
    const image = product.image
      ? `<img src="${escapeHTML(product.image)}" alt="${name}" loading="lazy">`
      : '<div class="image-placeholder">JAINEX</div>';

    return `
      <article class="product-card">
        <div class="product-image">${image}</div>
        <div class="product-info">
          <div class="product-category">${category}</div>
          <h3>${name}</h3>
          <p>${description}</p>
          <div class="product-bottom">
            <strong>${money(price)}</strong>
            <button type="button" class="mini-order" data-id="${id}">
              Enquire ↗
            </button>
          </div>
          <button type="button" class="add-to-cart" data-id="${id}">
            Add to Cart
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function addToCart(product) {
  if (!product) return;

  const id = String(product.id);
  const existing = cart.find((item) => String(item.id) === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartDisplay();

  const cartSection = document.getElementById("cartSection");
  if (cartSection) {
    cartSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function changeQuantity(id, change) {
  const item = cart.find((product) => String(product.id) === String(id));
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeCartItem(id);
    return;
  }

  updateCartDisplay();
}

function removeCartItem(id) {
  cart = cart.filter((item) => String(item.id) !== String(id));
  updateCartDisplay();
}

function updateCartDisplay() {
  const itemsContainer = document.getElementById("cartItems");
  const subtotalElement = document.getElementById("cartSubtotal");
  const gstElement = document.getElementById("cartGST");
  const totalElement = document.getElementById("cartTotal");

  let subtotal = 0;
  let gstTotal = 0;

  cart.forEach((item) => {
    const price = Number(item.price) || 0;
    const gstRate = Number(item.gst) || 0;

    subtotal += price * item.quantity;
    gstTotal += price * item.quantity * gstRate / 100;
  });

  const total = subtotal + gstTotal;

  if (itemsContainer) {
    if (cart.length === 0) {
      itemsContainer.innerHTML = "Your cart is empty.";
    } else {
      itemsContainer.innerHTML = cart.map((item) => `
        <div class="cart-item">
          <div>
            <strong>${escapeHTML(item.name)}</strong>
            <p>${money(item.price)} per piece</p>
            <p>GST: ${Number(item.gst) || 0}%</p>
          </div>
          <div class="cart-controls">
            <button type="button" data-cart-action="minus"
              data-id="${escapeHTML(item.id)}">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-action="plus"
              data-id="${escapeHTML(item.id)}">+</button>
            <button type="button" data-cart-action="remove"
              data-id="${escapeHTML(item.id)}">Remove</button>
          </div>
          <p>Amount: ${money((Number(item.price) || 0) * item.quantity)}</p>
        </div>
      `).join("");
    }
  }

  if (subtotalElement) subtotalElement.textContent = money(subtotal);
  if (gstElement) gstElement.textContent = money(gstTotal);
  if (totalElement) totalElement.textContent = money(total);

  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  });
}

function setupEvents() {
  if (grid) {
    grid.addEventListener("click", (event) => {
      const addButton = event.target.closest(".add-to-cart");
      const enquireButton = event.target.closest(".mini-order");

      if (!addButton && !enquireButton) return;

      const button = addButton || enquireButton;
      const product = products.find(
        (item) => String(item.id) === String(button.dataset.id)
      );

      if (!product) return;

      if (addButton) {
        addToCart(product);
      } else {
        whatsapp(
          `Hello Jainex Kitchenware,\n` +
          `I want to enquire about: ${product.name}\n` +
          `Price: ${money(product.price)} per piece\n` +
          `GST: ${Number(product.gst) || 0}%`
        );
      }
    });
  }

  if (search) {
    search.addEventListener("input", render);
  }

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.category || "all";
      render();
    });
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cart-action]");
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.cartAction;

    if (action === "plus") changeQuantity(id, 1);
    if (action === "minus") changeQuantity(id, -1);
    if (action === "remove") removeCartItem(id);
  });

  const checkoutButton = document.getElementById("checkoutButton");
  const checkoutForm = document.getElementById("checkoutForm");

  if (checkoutButton && checkoutForm) {
    checkoutButton.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Please add a product to your cart first.");
        return;
      }

      checkoutForm.hidden = false;
      checkoutForm.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const orderForm = document.getElementById("orderForm");

  if (orderForm) {
    orderForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (cart.length === 0) {
        alert("Your cart is empty. Please add a product first.");
        return;
      }

      const getValue = (id) =>
        document.getElementById(id)?.value.trim() || "";

      const customerName = getValue("customerName");
      const phone = getValue("customerPhone");
      const address = getValue("customerAddress");
      const city = getValue("customerCity");
      const state = getValue("customerState");
      const pin = getValue("customerPin");
      const gstin = getValue("customerGST");

      let subtotal = 0;
      let gstTotal = 0;

      const orderLines = cart.map((item) => {
        const price = Number(item.price) || 0;
        const rate = Number(item.gst) || 0;
        const amount = price * item.quantity;
        const tax = amount * rate / 100;

        subtotal += amount;
        gstTotal += tax;

        return `${item.name} | Qty: ${item.quantity} | Price: ${money(price)} | GST: ${rate}% | Amount before GST: ${money(amount)}`;
      });

      const message = [
        "NEW ORDER - JAINEX KITCHENWARE",
        "",
        ...orderLines,
        "",
        `Subtotal: ${money(subtotal)}`,
        `GST: ${money(gstTotal)}`,
        `Total: ${money(subtotal + gstTotal)}`,
        "",
        `Customer / Shop: ${customerName}`,
        `Mobile: ${phone}`,
        `Address: ${address}`,
        `City: ${city}`,
        `State: ${state}`,
        `PIN Code: ${pin}`,
        `GSTIN: ${gstin || "Not provided"}`
      ].join("\n");

      whatsapp(message);
    });
  }

  const contactButton = document.getElementById("contactWhatsApp");
  if (contactButton) {
    contactButton.addEventListener("click", () => {
      whatsapp("Hello Jainex Kitchenware, I want to enquire about your products.");
    });
  }

  const floatingWhatsApp = document.getElementById("floatingWhatsApp");
  if (floatingWhatsApp) {
    floatingWhatsApp.addEventListener("click", () => {
      whatsapp("Hello Jainex Kitchenware, I want to enquire about your products.");
    });
  }
}

async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

async function init() {
  setupEvents();

  try {
    const data = await loadJSON("data/products.json");
    products = Array.isArray(data) ? data : (data.products || []);
    render();
  } catch (error) {
    console.error("Product loading error:", error);
    if (grid) {
      grid.innerHTML =
        '<div class="empty">Products could not load. Please check data/products.json.</div>';
    }
  }

  try {
    const site = await loadJSON("data/site.json");
    applySiteSettings(site);
  } catch (error) {
    console.warn("Site settings could not load:", error);
  }

  updateCartDisplay();
}

document.addEventListener("DOMContentLoaded", init);

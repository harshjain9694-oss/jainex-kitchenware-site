// Jainex Kitchenware website content is managed in data/products.json and data/site.json.
// WhatsApp number is in international format without + or spaces.
const WHATSAPP_NUMBER = "916375571735";
let products = [];
let activeFilter = "all";
const grid = document.getElementById("productGrid");
const search = document.getElementById("searchInput");
const money = n => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(n) || 0);

function whatsapp(message) {
  if (!WHATSAPP_NUMBER) { alert("WhatsApp number is not configured yet."); return; }
  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
}
function setText(id, value) {
  const el = document.getElementById(id);
  if (el && typeof value === "string") el.textContent = value;
}
function applySiteSettings(site) {
  const root = document.documentElement;
  if (site.backgroundColor) root.style.setProperty("--paper", site.backgroundColor);
  if (site.heroBackgroundColor) root.style.setProperty("--cream", site.heroBackgroundColor);
  if (site.accentColor) root.style.setProperty("--red", site.accentColor);
  if (site.headerBackgroundColor) root.style.setProperty("--header-bg", site.headerBackgroundColor);
  if (site.wholesaleBackgroundColor) root.style.setProperty("--wholesale-bg", site.wholesaleBackgroundColor);
  ["announcement", "heroEyebrow", "heroTitleBefore", "heroTitleAccent", "heroDescription", "productsEyebrow", "productsTitleBefore", "productsTitleAccent", "productsIntro", "aboutEyebrow", "aboutTitleBefore", "aboutTitleAccent", "aboutText", "contactTitle", "contactText", "footerTagline"].forEach(k => setText(k, site[k]));
  document.title = site.pageTitle || "Jainex Kitchenware | Retail & Wholesale";
  const desc = document.querySelector('meta[name="description"]');
  if (desc && site.metaDescription) desc.setAttribute("content", site.metaDescription);
}
function categoryLabel(category) {
  return ({ storage: "Storage", serveware: "Serveware", tools: "Kitchen tools" })[category] || "Kitchenware";
}
function render() {
  const q = search.value.trim().toLowerCase();
  const list = products.filter(p => p.active !== false && (activeFilter === "all" || p.category === activeFilter) && (String(p.name || "") + " " + String(p.description || "") + " " + categoryLabel(p.category)).toLowerCase().includes(q));
  if (!list.length) { grid.innerHTML = '<div class="empty">No products found. Try another search.</div>'; return; }
  grid.innerHTML = list.map(p => {
    const image = p.image ? `<img src="${String(p.image).replaceAll('"', '&quot;')}" alt="${String(p.name || '').replaceAll('"', '&quot;')}" loading="lazy">` : `<span class="product-placeholder">${p.icon || "◉"}</span>`;
    return `<article class="product-card"><div class="product-image">${image}${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}</div><div class="product-info"><span class="category">${categoryLabel(p.category)}</span><h3>${p.name || "Kitchenware product"}</h3><p>${p.description || "Contact us for product details."}</p><div class="product-bottom"><span class="price">${money(p.price)}<small>listed price</small></span><button class="mini-order" data-id="${p.id}">Enquire ↗</button></div></div></article>`;
  }).join("");
  grid.querySelectorAll(".mini-order").forEach(b => b.addEventListener("click", () => {
    const p = products.find(x => String(x.id) === b.dataset.id);
    if (p) whatsapp(`Hello Jainex Kitchenware, I want to enquire about ${p.name}. Listed price: ${money(p.price)}. Please confirm current price, availability and delivery.`);
  }));
}
async function init() {
  try {
    const [productsResponse, siteResponse] = await Promise.all([fetch("data/products.json"), fetch("data/site.json")]);
    if (!productsResponse.ok || !siteResponse.ok) throw new Error("Could not load website content files.");
    products = await productsResponse.json();
    const site = await siteResponse.json();
    applySiteSettings(site);
  } catch (err) {
    grid.innerHTML = '<div class="empty">Website content could not load. Please publish the full website folder, including the data folder.</div>';
    console.error(err);
    return;
  }
  render();
}
document.querySelectorAll(".filter").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".filter").forEach(x => x.classList.remove("active"));
  b.classList.add("active"); activeFilter = b.dataset.filter; render();
}));
search.addEventListener("input", render);
document.getElementById("wholesaleButton").addEventListener("click", () => whatsapp("Hello Jainex Kitchenware, I am interested in wholesale/bulk orders. Please share your catalogue, MOQ, wholesale prices and delivery details.\nBusiness name:\nCity:\nProducts/quantity needed:"));
document.getElementById("contactButton").addEventListener("click", () => whatsapp("Hello Jainex Kitchenware, I would like to enquire about your products."));
document.getElementById("floatingWhatsApp").addEventListener("click", e => { e.preventDefault(); whatsapp("Hello Jainex Kitchenware, I would like to enquire about your products."); });
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("menuToggle").addEventListener("click", () => document.getElementById("navMenu").classList.toggle("open"));
document.querySelectorAll("#navMenu a").forEach(a => a.addEventListener("click", () => document.getElementById("navMenu").classList.remove("open")));
init();
const cart = [];

function addToCart(product) {
  const id = String(product.id);
  const existing = cart.find(item => String(item.id) === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      quantity: 1
    });
  }
  updateCartDisplay();
}
function updateCartDisplay() {
  const itemsBox = document.getElementById("cartItems");
  const subtotalBox = document.getElementById("cartSubtotal");
  const gstBox = document.getElementById("cartGST");
  const totalBox = document.getElementById("cartTotal");

  if (!itemsBox || !subtotalBox || !gstBox || !totalBox) return;

  if (cart.length === 0) {
    itemsBox.textContent = "Your cart is empty.";
  } else {
    itemsBox.innerHTML = cart.map((item, index) => `
      <div>
        <strong>${item.name}</strong> — ₹${item.price}
        <button type="button" onclick="changeQuantity(${index}, -1)">−</button>
        <span>${item.quantity}</span>
        <button type="button" onclick="changeQuantity(${index}, 1)">+</button>
        <button type="button" onclick="removeCartItem(${index})">Remove</button>
      </div>
    `).join("");
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.05);
  subtotalBox.textContent = subtotal.toFixed(2);
  gstBox.textContent = gst.toFixed(2);
  totalBox.textContent = (subtotal + gst).toFixed(2);
}

function changeQuantity(index, amount) {
  if (!cart[index]) return;
  cart[index].quantity += amount;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  updateCartDisplay();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}

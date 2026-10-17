/* Jainex Kitchenware: catalogue, product details, cart and WhatsApp checkout */
let WHATSAPP_NUMBER = "916375571735";
const SITE_SETTINGS_KEY = "jainexAdminSiteSettings";
const PRODUCTS_KEY = "jainexAdminProducts";
let siteSettings = {};
let categoriesPage = 0;
let categoryDefinitions = [];
const CART_KEY = "jainexKitchenwareCart";
const GST_RATE = 5;
let products = [];
let cart = readCart();
let activeFilter = "all";
let productPage = 0;
const PRODUCTS_PER_PAGE = 6;

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const money = value => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 2
}).format(Number(value) || 0);

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}
function readCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter(x => x && x.id != null)
      .map(x => ({...x, quantity: Math.max(1, Number(x.quantity) || 1)})) : [];
  } catch { return []; }
}
function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
  updateCartBadge();
  renderCartPage();
}
function whatsapp(message) {
  const number = String(siteSettings.whatsappNumber || WHATSAPP_NUMBER).replace(/\D/g, "");
  window.open("https://wa.me/" + number + "?text=" + encodeURIComponent(message), "_blank", "noopener");
}
function label(category) {
  const custom = (categoryDefinitions || []).find(c => c.key === category);
  return custom?.title || ({storage:"Storage & Stands", serveware:"Serveware", tools:"Kitchen Tools", kitchenware:"Kitchenware", cookware:"Cookware", accessories:"Accessories", "matka-stand":"Matka Stand", "kitchen-sink":"Kitchen Sink", "chopping-board":"Chopping Board", "plate-rack":"Plate Rack", "dish-drainer":"Dish Drainer", "fruit-trolley":"Fruit Trolley", "oven-stand":"Oven Stand", "wall-hook-rack":"Wall Hook Rack"})[category] || category || "Kitchenware";
}
function findProduct(id) { return products.find(p => String(p.id) === String(id)); }
function cartItem(id) { return cart.find(p => String(p.id) === String(id)); }
function qty(id) { return cartItem(id)?.quantity || 0; }
function imageMarkup(product, className="product-image") {
  return product.image
    ? `<div class="${className}"><img src="${esc(product.image)}" alt="${esc(product.name)}" loading="lazy"></div>`
    : `<div class="${className}"><div class="image-placeholder">JAINEX</div></div>`;
}
function quantityMarkup(product) {
  const n = qty(product.id);
  if (!n) return `<button class="btn primary add-to-cart" data-id="${esc(product.id)}" type="button">Add to Cart</button>`;
  return `<div class="quantity-control"><button type="button" data-qty="minus" data-id="${esc(product.id)}" aria-label="Decrease quantity">−</button><span>${n}</span><button type="button" data-qty="plus" data-id="${esc(product.id)}" aria-label="Increase quantity">+</button></div>`;
}
function productCard(p) {
  const id = encodeURIComponent(p.id);
  return `<article class="product-card">
    <a class="product-card-link" href="product.html?id=${id}">
      ${imageMarkup(p)}
      <div class="product-info">
        <div class="category">${esc(label(p.category))}</div>
        <h3>${esc(p.name || "Kitchenware Product")}</h3>
        <p>${esc(p.description || "")}</p>
        <div class="product-bottom"><strong class="price">${money(p.price)}<small>per piece · GST ${GST_RATE}%</small></strong></div>
      </div>
    </a>
    <div class="product-actions">
      ${quantityMarkup(p)}
    </div>
  </article>`;
}
function renderCategoryCards() {
  const grid = $("#categoryGrid");
  if (!grid) return;
  const categories = categoryDefinitions.length ? categoryDefinitions : [
    {key:"matka-stand", title:"Matka Stand", image:"assets/categories/matka-stand.jpg"},
    {key:"kitchen-sink", title:"Kitchen Sink", image:"assets/categories/kitchen-sink.jpg"},
    {key:"chopping-board", title:"Chopping Board", image:"assets/categories/chopping-board.jpg"},
    {key:"plate-rack", title:"Plate Rack", image:"assets/categories/plate-rack.jpg"},
    {key:"dish-drainer", title:"Dish Drainer", image:"assets/categories/dish-drainer.jpg"},
    {key:"fruit-trolley", title:"Fruit Trolley", image:"assets/categories/fruit-trolley.jpg"},
    {key:"oven-stand", title:"Oven Stand", image:"assets/categories/oven-stand.jpg"},
    {key:"wall-hook-rack", title:"Wall Hook Rack", image:"assets/categories/wall-hook-rack.jpg"}
  ];
  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(categories.length / pageSize));
  categoriesPage = Math.min(categoriesPage, pageCount - 1);
  const visible = categories.slice(categoriesPage * pageSize, categoriesPage * pageSize + pageSize);
  grid.innerHTML = visible.map(cat => {
    const matches = products.filter(p => p.active !== false && (p.category || "kitchenware") === cat.key);
    const visual = cat.image
      ? `<div class="category-image"><img src="${esc(cat.image)}" alt="${esc(cat.title)}" loading="lazy"></div>`
      : `<div class="category-image category-placeholder"><span>JAINEX</span></div>`;
    const note = matches.length ? `${matches.length} product${matches.length===1?"":"s"} →` : "View category →";
    return `<a class="category-card" href="category.html?category=${encodeURIComponent(cat.key)}">${visual}<strong>${esc(cat.title)}</strong><span>${note}</span></a>`;
  }).join("");
  const prev = $("#categoryPrev"), next = $("#categoryNext"), dots = $("#categoryPageDots");
  if (prev) prev.disabled = categoriesPage === 0;
  if (next) next.disabled = categoriesPage >= pageCount - 1;
  if (dots) dots.innerHTML = pageCount > 1 ? Array.from({length:pageCount}, (_,i)=>`<button type="button" class="category-page-dot ${i===categoriesPage?'is-active':''}" data-category-page="${i}" aria-label="Show category page ${i+1}"></button>`).join("") : "";
}
function setupCategoryCarousel() {
  $("#categoryPrev")?.addEventListener("click", () => { if (categoriesPage > 0) { categoriesPage--; renderCategoryCards(); } });
  $("#categoryNext")?.addEventListener("click", () => { const count = Math.ceil(categoryDefinitions.length / 6); if (categoriesPage < count - 1) { categoriesPage++; renderCategoryCards(); } });
  $("#categoryPageDots")?.addEventListener("click", e => { const b=e.target.closest("[data-category-page]"); if (b) { categoriesPage=Number(b.dataset.categoryPage)||0; renderCategoryCards(); } });
}
function renderProductFilters() {
  const holder = $("#productFilters");
  if (!holder) return;
  const items = [{key:"all", title:"All products"}, ...categoryDefinitions.map(c=>({key:c.key,title:c.title}))];
  holder.innerHTML = items.map((c,i)=>`<button class="filter ${i===0?"active":""}" data-filter="${esc(c.key)}">${esc(c.title)}</button>`).join("");
}

function renderProducts() {
  const grid = $("#productGrid");
  if (!grid) return;
  const query = ($("#searchInput")?.value || "").trim().toLowerCase();
  const categoryPage = new URLSearchParams(location.search).get("category");
  const category = categoryPage || activeFilter;
  const list = products.filter(p => p.active !== false &&
    (category === "all" || p.category === category) &&
    [p.name,p.category,p.description].join(" ").toLowerCase().includes(query));
  const pageCount = Math.max(1, Math.ceil(list.length / PRODUCTS_PER_PAGE));
  productPage = Math.min(productPage, pageCount - 1);
  const visible = list.slice(productPage * PRODUCTS_PER_PAGE, productPage * PRODUCTS_PER_PAGE + PRODUCTS_PER_PAGE);
  grid.innerHTML = list.length ? visible.map(productCard).join("") :
    '<div class="empty">No products found in this category yet.</div>';
  const prev = $("#productPrev"), next = $("#productNext"), label = $("#productPageLabel"), pager = $("#productPagination");
  if (pager) pager.style.display = pageCount > 1 ? "flex" : "none";
  if (prev) prev.disabled = productPage === 0;
  if (next) next.disabled = productPage >= pageCount - 1;
  if (label) label.textContent = `Page ${productPage + 1} of ${pageCount}`;
}
function renderProductDetails() {
  const container = $("#productDetails");
  if (!container) return;
  const id = new URLSearchParams(location.search).get("id");
  const p = findProduct(id);
  if (!p || p.active === false) {
    container.innerHTML = '<div class="empty"><h2>Product not found</h2><a href="index.html#categories">Browse categories</a></div>';
    return;
  }
  const price = Number(p.price) || 0, gst = GST_RATE;
  container.innerHTML = `<div class="detail-layout">
    ${imageMarkup(p, "detail-image")}
    <div class="detail-copy">
      <div class="category">${esc(label(p.category))}</div>
      <h1>${esc(p.name)}</h1>
      <div class="detail-price">${money(price)} <small>per piece</small></div>
      <p class="gst-note">GST: ${gst}% ${gst ? `(${money(price*gst/100)} per piece)` : ""}</p>
      <p class="detail-description">${esc(p.description || "Contact us for product details.")}</p>
      <div class="detail-total"><span>Price including GST per piece</span><strong>${money(price + price*gst/100)}</strong></div>
      ${quantityMarkup(p)}
      <p><a href="category.html?category=${encodeURIComponent(p.category || "kitchenware")}">← More ${esc(label(p.category))}</a></p>
    </div></div>`;
}
function totals() {
  let subtotal = 0, tax = 0;
  cart.forEach(p => { const amount = (Number(p.price)||0)*p.quantity; subtotal += amount; tax += amount*GST_RATE/100; });
  return {subtotal, tax, total:subtotal+tax, count:cart.reduce((n,p)=>n+p.quantity,0)};
}
function updateCartBadge() {
  const t = totals();
  $$("[data-cart-count]").forEach(el => el.textContent = t.count);
  $$("[data-cart-total]").forEach(el => el.textContent = money(t.total));
}
function renderCartPage() {
  const container = $("#cartPageItems");
  if (!container) { updateCartBadge(); return; }
  const summary = $("#cartSummary");
  if (!cart.length) {
    container.innerHTML = '<div class="empty"><h2>Your cart is empty</h2><p>Choose products to start an order.</p><a class="btn primary" href="index.html#categories">Browse Products</a></div>';
    if (summary) summary.hidden = true;
    updateCartBadge();
    return;
  }
  if (summary) summary.hidden = false;
  container.innerHTML = cart.map(item => {
    const p = findProduct(item.id) || item;
    const amount = (Number(item.price)||0)*item.quantity;
    const tax = amount*GST_RATE/100;
    return `<article class="cart-row">
      <a class="cart-product" href="product.html?id=${encodeURIComponent(item.id)}">
        ${imageMarkup(p, "cart-image")}
        <span><strong>${esc(item.name)}</strong><small>${money(item.price)} per piece · GST ${GST_RATE}%</small></span>
      </a>
      <div class="cart-qty"><button type="button" data-qty="minus" data-id="${esc(item.id)}">−</button><span>${item.quantity}</span><button type="button" data-qty="plus" data-id="${esc(item.id)}">+</button></div>
      <div class="cart-line-total"><small>Item total incl. GST</small><strong>${money(amount+tax)}</strong><button type="button" class="remove-item" data-remove="${esc(item.id)}">Remove</button></div>
    </article>`;
  }).join("");
  const t = totals();
  if ($("#cartSubtotal")) $("#cartSubtotal").textContent = money(t.subtotal);
  if ($("#cartGST")) $("#cartGST").textContent = money(t.tax);
  if ($("#cartTotal")) $("#cartTotal").textContent = money(t.total);
  updateCartBadge();
}
function addToCart(p) {
  if (!p) return;
  const existing = cartItem(p.id);
  if (existing) existing.quantity += 1;
  else cart.push({...p, quantity:1});
  saveCart();
  renderProducts();
  renderProductDetails();
}
function changeQuantity(id, delta) {
  const item = cartItem(id);
  if (!item && delta > 0) { const p = findProduct(id); if (p) addToCart(p); return; }
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter(p => String(p.id) !== String(id));
  saveCart();
  renderProducts();
  renderProductDetails();
}
function removeItem(id) {
  cart = cart.filter(p => String(p.id) !== String(id));
  saveCart();
  renderProducts();
  renderProductDetails();
}
function setupEvents() {
  document.addEventListener("click", event => {
    const add = event.target.closest(".add-to-cart");
    const qtyButton = event.target.closest("[data-qty]");
    const remove = event.target.closest("[data-remove]");
    if (add) { event.preventDefault(); addToCart(findProduct(add.dataset.id)); }
    if (qtyButton) { event.preventDefault(); changeQuantity(qtyButton.dataset.id, qtyButton.dataset.qty === "plus" ? 1 : -1); }
    if (remove) { event.preventDefault(); removeItem(remove.dataset.remove); }
  });
  $("#searchInput")?.addEventListener("input", () => { productPage = 0; renderProducts(); });
  $("#productPrev")?.addEventListener("click", () => { if (productPage > 0) { productPage--; renderProducts(); } });
  $("#productNext")?.addEventListener("click", () => { productPage++; renderProducts(); });
  $("#menuToggle")?.addEventListener("click", () => $("#navMenu")?.classList.toggle("open"));
  $("#wholesaleButton")?.addEventListener("click", () => whatsapp("Hello Jainex Kitchenware, I am interested in wholesale pricing. Please share your product catalogue and minimum order quantities."));
  $("#contactButton")?.addEventListener("click", () => whatsapp("Hello Jainex Kitchenware, I want to enquire about your products."));
  $("#floatingWhatsApp")?.addEventListener("click", e => { e.preventDefault(); whatsapp("Hello Jainex Kitchenware, I want to enquire about your products."); });
  $("#orderForm")?.addEventListener("submit", event => {
    event.preventDefault();
    if (!cart.length) { alert("Your cart is empty."); return; }
    const val = id => $(`#${id}`)?.value.trim() || "";
    const t = totals();
    const lines = cart.map(p => `${p.name} | Qty ${p.quantity} | Unit ${money(p.price)} | GST ${GST_RATE}% | Line total ${money((Number(p.price)||0)*p.quantity*(1+GST_RATE/100))}`);
    const message = ["NEW ORDER - JAINEX KITCHENWARE", "", ...lines, "", `Subtotal: ${money(t.subtotal)}`, `GST: ${money(t.tax)}`, `TOTAL: ${money(t.total)}`, "", `Customer / Shop: ${val("customerName")}`, `Mobile: ${val("customerPhone")}`, `Address: ${val("customerAddress")}`, `City: ${val("customerCity")}`, `State: ${val("customerState")}`, `PIN: ${val("customerPin")}`, `GSTIN: ${val("customerGST") || "Not provided"}`].join("\n");
    whatsapp(message);
  });
}

function renderHeroSlider(site) {
  const track = $("#sliderTrack");
  const dots = $("#sliderDots");
  if (!track || !dots) return;

  const defaults = [
    {image:"assets/banners/slider-kitchen-organization.jpg", title:"Smart Kitchen Organization", text:"Keep your kitchen neat, clean and stylish."},
    {image:"assets/banners/slider-chopping-board.jpg", title:"Hygienic Chopping Everyday", text:"Durable, easy to clean and long lasting."},
    {image:"assets/banners/slider-wall-hooks.jpg", title:"Stylish Wall Hooks", text:"Strong, durable and multi-purpose."},
    {image:"assets/banners/slider-fruit-rack.jpg", title:"Everyday Utility", text:"Elegant, sturdy and multi-use."}
  ];

  const slides = defaults.map((fallback, i) => ({
    image: site?.[`slide${i+1}Image`] || fallback.image,
    title: site?.[`slide${i+1}Title`] || fallback.title,
    text: site?.[`slide${i+1}Text`] || fallback.text
  }));

  track.innerHTML = slides.map((slide, i) => `
    <a class="hero-slide ${i === 0 ? "is-active" : ""}" href="products.html"
      style="background-image:url('${encodeURI(String(slide.image)).replace(/'/g, "%27")}')"
      aria-label="${esc(slide.title)}" aria-hidden="${i === 0 ? "false" : "true"}"></a>`).join("");

  dots.innerHTML = slides.map((_, i) =>
    `<button type="button" class="slider-dot ${i === 0 ? "is-active" : ""}" data-slide-to="${i}" aria-label="Show banner ${i+1}"></button>`
  ).join("");

  let current = 0;
  let timer;
  const show = index => {
    current = (index + slides.length) % slides.length;
    $$(".hero-slide", track).forEach((slide, i) => {
      slide.classList.toggle("is-active", i === current);
      slide.setAttribute("aria-hidden", i === current ? "false" : "true");
    });
    $$(".slider-dot", dots).forEach((dot, i) => dot.classList.toggle("is-active", i === current));
  };
  const restart = () => {
    clearInterval(timer);
    timer = setInterval(() => show(current + 1), 5000);
  };
  $("#sliderPrev")?.addEventListener("click", () => { show(current - 1); restart(); });
  $("#sliderNext")?.addEventListener("click", () => { show(current + 1); restart(); });
  dots.addEventListener("click", event => {
    const dot = event.target.closest("[data-slide-to]");
    if (dot) { show(Number(dot.dataset.slideTo)); restart(); }
  });
  restart();
}

async function init() {
  setupEvents();
  updateCartBadge();
  try {
    const response = await fetch("data/products.json");
    if (!response.ok) throw new Error("Could not load data/products.json");
    const fileData = await response.json();
    let data = fileData;
    try { const saved = localStorage.getItem(PRODUCTS_KEY); if (saved) data = JSON.parse(saved); } catch {}
    products = (Array.isArray(data) ? data : (data.products || [])).map(p => ({...p, gst: GST_RATE}));
    // Refresh saved cart item details from the current catalogue.
    cart = cart.map(item => {
      const latest = findProduct(item.id);
      return latest ? {...latest, gst: GST_RATE, quantity:item.quantity} : {...item, gst: GST_RATE};
    });
    saveCart();
    setupCategoryCarousel();
    renderCategoryCards();
    renderProductFilters();
    renderProducts();
    renderProductDetails();
    renderCartPage();
  } catch (error) {
    console.error(error);
    const grid = $("#productGrid") || $("#categoryGrid") || $("#productDetails");
    if (grid) grid.innerHTML = '<p class="empty">Products could not load. Please refresh or check data/products.json.</p>';
  }
  try {
    const response = await fetch("data/site.json");
    if (response.ok) {
      const fileSite = await response.json();
      try { siteSettings = JSON.parse(localStorage.getItem(SITE_SETTINGS_KEY) || "{}"); } catch { siteSettings = {}; }
      const site = {...fileSite, ...siteSettings};
      siteSettings = site;
      WHATSAPP_NUMBER = site.whatsappNumber || WHATSAPP_NUMBER;
      categoryDefinitions = Array.isArray(site.categories) ? site.categories : [];
      renderCategoryCards();
      renderProductFilters();
      renderProducts();
      renderHeroSlider(site);
      if ($("#announcement") && site.announcement) $("#announcement").textContent = site.announcement;
      $$(".brand img, .footer-logo img").forEach(img => { if (site.logoPath) img.src = site.logoPath; });
      if ($("#heroEyebrow") && site.heroEyebrow) $("#heroEyebrow").textContent = site.heroEyebrow;
      if ($("#heroTitleBefore") && site.heroTitleBefore) $("#heroTitleBefore").textContent = site.heroTitleBefore;
      if ($("#heroTitleAccent") && site.heroTitleAccent) $("#heroTitleAccent").textContent = site.heroTitleAccent;
      if ($("#heroDescription") && site.heroDescription) $("#heroDescription").textContent = site.heroDescription;
      if ($("#productsEyebrow") && site.productsEyebrow) $("#productsEyebrow").textContent = site.productsEyebrow;
      if ($("#productsTitleBefore") && site.productsTitleBefore) $("#productsTitleBefore").textContent = site.productsTitleBefore;
      if ($("#productsTitleAccent") && site.productsTitleAccent) $("#productsTitleAccent").textContent = site.productsTitleAccent;
      if ($("#productsIntro") && site.productsIntro) $("#productsIntro").textContent = site.productsIntro;
      if ($("#aboutText") && site.aboutText) $("#aboutText").textContent = site.aboutText;
      if ($("#contactTitle") && site.contactTitle) $("#contactTitle").textContent = site.contactTitle;
      if ($("#contactText") && site.contactText) $("#contactText").textContent = site.contactText;
      if ($("#aboutEyebrow") && site.aboutEyebrow) $("#aboutEyebrow").textContent = site.aboutEyebrow;
      if ($("#aboutTitleBefore") && site.aboutTitleBefore) $("#aboutTitleBefore").textContent = site.aboutTitleBefore;
      if ($("#aboutTitleAccent") && site.aboutTitleAccent) $("#aboutTitleAccent").textContent = site.aboutTitleAccent;
      if ($("#footerTagline") && site.footerTagline) $("#footerTagline").textContent = site.footerTagline;
      const root = document.documentElement.style;
      if (site.backgroundColor) root.setProperty("--paper", site.backgroundColor.replace(/\s/g,""));
      if (site.heroBackgroundColor) root.setProperty("--cream", site.heroBackgroundColor);
      if (site.accentColor) root.setProperty("--red", site.accentColor);
      if (site.headerBackgroundColor) root.setProperty("--header-bg", site.headerBackgroundColor.replace(/\s/g,""));
      if (site.wholesaleBackgroundColor) root.setProperty("--wholesale-bg", site.wholesaleBackgroundColor);
    }
  } catch (error) { console.warn("Site settings not loaded", error); }
  if ($("#year")) $("#year").textContent = new Date().getFullYear();
}
document.addEventListener("DOMContentLoaded", init);

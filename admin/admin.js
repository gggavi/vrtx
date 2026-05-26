/**
 * VRTX — ADMIN.JS
 * Lógica completa del panel de administración:
 * login, CRUD de productos, dashboard, configuración.
 */

/* ──────────────────────────────────────────────────────────
   ESTADO
────────────────────────────────────────────────────────── */
let currentView  = "dashboard";
let editingId    = null;   // null = nuevo producto
let confirmCb    = null;   // callback de confirmación

/* ──────────────────────────────────────────────────────────
   TOAST
────────────────────────────────────────────────────────── */
function adminToast(msg, isSuccess = false) {
  const t = document.getElementById("adminToast");
  if (!t) return;
  t.textContent = msg;
  t.className   = "admin-toast show" + (isSuccess ? " success" : "");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = "admin-toast"; }, 2600);
}

/* ──────────────────────────────────────────────────────────
   CONFIRM DIALOG
────────────────────────────────────────────────────────── */
function openConfirm(msg, cb) {
  document.getElementById("confirmMsg").textContent = msg;
  document.getElementById("confirmOverlay").classList.add("open");
  confirmCb = cb;
}
function closeConfirm() {
  document.getElementById("confirmOverlay").classList.remove("open");
  confirmCb = null;
}
document.getElementById("confirmYes")?.addEventListener("click", () => {
  closeConfirm();
  if (confirmCb) confirmCb();
});

/* ──────────────────────────────────────────────────────────
   LOGIN
────────────────────────────────────────────────────────── */
function checkLogin() {
  return sessionStorage.getItem("vrtx_admin_auth") === "yes";
}

document.getElementById("loginBtn")?.addEventListener("click", attemptLogin);
document.getElementById("loginPass")?.addEventListener("keydown", e => {
  if (e.key === "Enter") attemptLogin();
});

function attemptLogin() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value;
  const err  = document.getElementById("loginError");

  if (user === CONFIG.adminUser && pass === CONFIG.adminPass) {
    sessionStorage.setItem("vrtx_admin_auth", "yes");
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
    document.getElementById("topbarUsername").textContent = user;
    initAdmin();
  } else {
    err.textContent = "Usuario o contraseña incorrectos.";
    document.getElementById("loginPass").value = "";
  }
}

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  sessionStorage.removeItem("vrtx_admin_auth");
  location.reload();
});

/* ──────────────────────────────────────────────────────────
   INIT
────────────────────────────────────────────────────────── */
function initAdmin() {
  initData(); // load sample data if needed
  initSidebar();
  initSidebarToggle();
  showView("dashboard");
}

// Auto-login check on load
window.addEventListener("DOMContentLoaded", () => {
  if (checkLogin()) {
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
    initAdmin();
  }
});

/* ──────────────────────────────────────────────────────────
   NAVIGATION
────────────────────────────────────────────────────────── */
function initSidebar() {
  document.querySelectorAll(".nav-item[data-view]").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      showView(link.dataset.view);
      // Close on mobile
      document.getElementById("sidebar").classList.remove("open");
    });
  });
}

function showView(viewId) {
  currentView = viewId;

  // Hide all views
  document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
  const target = document.getElementById("view-" + viewId);
  if (target) target.classList.remove("hidden");

  // Update active nav
  document.querySelectorAll(".nav-item[data-view]").forEach(l => {
    l.classList.toggle("active", l.dataset.view === viewId);
  });

  // Update topbar title
  const titles = {
    dashboard: "Dashboard",
    products:  "Productos",
    add:       editingId ? "Editar Producto" : "Agregar Producto",
    settings:  "Configuración"
  };
  document.getElementById("topbarTitle").textContent = titles[viewId] || viewId;

  // Load view content
  if (viewId === "dashboard") loadDashboard();
  if (viewId === "products")  loadProductsList();
  if (viewId === "add")       initProductForm();
  if (viewId === "settings")  loadSettings();
}

function initSidebarToggle() {
  document.getElementById("sidebarToggle")?.addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
  });
}

/* ──────────────────────────────────────────────────────────
   DASHBOARD
────────────────────────────────────────────────────────── */
async function loadDashboard() {
  const products = await getProducts();

  // Stats
  document.getElementById("statTotal").textContent    = products.length;
  document.getElementById("statActive").textContent   = products.filter(p => p.active !== false).length;
  document.getElementById("statNoStock").textContent  = products.filter(p => p.stock === 0).length;
  document.getElementById("statFeatured").textContent = products.filter(p => p.featured).length;

  // Category bars
  const catBars = document.getElementById("catBars");
  if (catBars) {
    const maxCount = Math.max(...CONFIG.categories.map(c => products.filter(p => p.category === c.id).length), 1);
    catBars.innerHTML = CONFIG.categories.map(cat => {
      const count = products.filter(p => p.category === cat.id).length;
      const pct   = Math.round((count / maxCount) * 100);
      return `
        <div class="cat-bar-row">
          <span class="cat-bar-label">${cat.label}</span>
          <div class="cat-bar-track">
            <div class="cat-bar-fill" style="width:${pct}%"></div>
          </div>
          <span class="cat-bar-num">${count}</span>
        </div>`;
    }).join("");
  }

  // Recent table (last 6 added)
  const recent = [...products].reverse().slice(0, 6);
  const tbody  = document.getElementById("recentTableBody");
  if (tbody) {
    tbody.innerHTML = recent.map(p => {
      let statusBadge;
      if (!p.active)      statusBadge = `<span class="badge-inactive">Inactivo</span>`;
      else if (p.stock === 0) statusBadge = `<span class="badge-nostock">Sin stock</span>`;
      else                statusBadge = `<span class="badge-active">Activo</span>`;

      return `<tr>
        <td>${p.name}</td>
        <td>${getCatLabel(p.category)}</td>
        <td>$${Number(p.price).toLocaleString("es-AR")}</td>
        <td>${p.stock}</td>
        <td>${statusBadge}</td>
      </tr>`;
    }).join("");
  }
}

function getCatLabel(catId) {
  const c = CONFIG.categories.find(c => c.id === catId);
  return c ? c.label : catId;
}

/* ──────────────────────────────────────────────────────────
   PRODUCTS LIST
────────────────────────────────────────────────────────── */
function loadProductsList() {
  renderAdminProducts();

  // Search
  const searchEl = document.getElementById("adminSearch");
  const catEl    = document.getElementById("adminCatFilter");

  searchEl?.addEventListener("input", renderAdminProducts);
  catEl?.addEventListener("change", renderAdminProducts);
}

async function renderAdminProducts() {
  const searchEl = document.getElementById("adminSearch");
  const catEl    = document.getElementById("adminCatFilter");
  const grid     = document.getElementById("adminProductsGrid");
  if (!grid) return;

  const q   = (searchEl?.value || "").trim().toLowerCase();
  const cat = catEl?.value || "all";
  let products = await getProducts();

  if (cat !== "all") products = products.filter(p => p.category === cat);
  if (q)             products = products.filter(p =>
    p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  );

  if (!products.length) {
    grid.innerHTML = `<p style="color:var(--text-dim);font-size:14px;grid-column:1/-1">No se encontraron productos.</p>`;
    return;
  }

  grid.innerHTML = products.map(p => {
    const img      = (p.images && p.images[0]) || "https://via.placeholder.com/260x160/1a1a1a/333?text=VRTX";
    const stockCls = p.stock === 0 ? "out" : p.stock <= 5 ? "low" : "";
    const stockTxt = p.stock === 0 ? "Sin stock" : p.stock <= 5 ? `Últimas ${p.stock} uds` : `${p.stock} en stock`;
    return `
      <div class="admin-product-card">
        <div class="apc-img">
          <img src="${img}" alt="${p.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/260x160/1a1a1a/333?text=VRTX'" />
          ${!p.active ? '<span class="apc-inactive-badge">Inactivo</span>' : ""}
        </div>
        <div class="apc-body">
          <div class="apc-cat">${getCatLabel(p.category)}</div>
          <div class="apc-name">${p.name}</div>
          <div class="apc-price">$${Number(p.price).toLocaleString("es-AR")}</div>
          <div class="apc-stock ${stockCls}">${stockTxt}</div>
          <div class="apc-actions">
            <button class="btn-edit" onclick="editProduct('${p.id}')">Editar</button>
            <button class="btn-toggle" title="${p.active ? "Desactivar" : "Activar"}" onclick="toggleActive('${p.id}')">${p.active !== false ? "👁" : "🚫"}</button>
            <button class="btn-delete" title="Eliminar" onclick="deleteProduct('${p.id}')">🗑</button>
          </div>
        </div>
      </div>`;
  }).join("");
}

/* ──────────────────────────────────────────────────────────
   PRODUCT FORM (Add / Edit)
────────────────────────────────────────────────────────── */
async function initProductForm() {
  const isEditing = !!editingId;
  document.getElementById("formTitle").textContent = isEditing ? "Editar Producto" : "Agregar Producto";

  // Render size checkboxes based on category (or all if editing)
  await renderSizeCheckboxes();
  await renderLabelCheckboxes();

  if (isEditing) {
    const products = await getProducts();
    const p        = products.find(x => x.id === editingId);
    if (p) fillForm(p);
  } else {
    clearForm();
  }

  // Category change → re-render sizes
  document.getElementById("fCategory")?.addEventListener("change", async () => {
    await renderSizeCheckboxes();
  });
}

async function renderSizeCheckboxes() {
  const catId   = document.getElementById("fCategory")?.value || "";
  const cat     = CONFIG.categories.find(c => c.id === catId);
  const sizes   = cat ? cat.sizes : ["XS","S","M","L","XL","XXL"];
  const wrap    = document.getElementById("sizesCheckboxes");
  if (!wrap) return;

  // Get current checked state if editing
  const products = await getProducts();
  const p = editingId ? products.find(x => x.id === editingId) : null;

  wrap.innerHTML = sizes.map(s => {
    const checked = p ? (p.sizes && p.sizes[s] ? "checked" : "") : "";
    return `
      <label class="size-check">
        <input type="checkbox" name="size" value="${s}" ${checked} />
        ${s}
      </label>`;
  }).join("");
}

async function renderLabelCheckboxes() {
  const wrap = document.getElementById("labelsCheckboxes");
  if (!wrap) return;

  const products = await getProducts();
  const p = editingId ? products.find(x => x.id === editingId) : null;
  const activeLabels = p ? (p.labels || []) : [];

  wrap.innerHTML = CONFIG.labels.map(l => {
    const checked = activeLabels.includes(l) ? "checked" : "";
    return `
      <label class="label-check">
        <input type="checkbox" name="label" value="${l}" ${checked} />
        ${l}
      </label>`;
  }).join("");
}

function fillForm(p) {
  document.getElementById("editId").value      = p.id;
  document.getElementById("fName").value       = p.name;
  document.getElementById("fCategory").value   = p.category;
  document.getElementById("fPrice").value      = p.price;
  document.getElementById("fOldPrice").value   = p.oldPrice || "";
  document.getElementById("fStock").value      = p.stock;
  document.getElementById("fDesc").value       = p.description;
  document.getElementById("fImages").value     = (p.images || []).join("\n");
  document.getElementById("fActive").checked   = p.active !== false;
  document.getElementById("fFeatured").checked = !!p.featured;

  // Re-render sizes with product data
  renderSizeCheckboxes();
  // Re-render labels with product data
  renderLabelCheckboxes();

  // Preview images
  previewImages();

  document.getElementById("formError").textContent = "";
}

function clearForm() {
  ["editId","fName","fPrice","fOldPrice","fStock","fDesc","fImages"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  document.getElementById("fCategory").value   = "";
  document.getElementById("fActive").checked   = true;
  document.getElementById("fFeatured").checked = false;
  document.getElementById("imgPreviews").innerHTML = "";
  document.getElementById("formError").textContent  = "";
}

function previewImages() {
  const raw  = document.getElementById("fImages")?.value || "";
  const urls = raw.split("\n").map(u => u.trim()).filter(Boolean);
  const wrap = document.getElementById("imgPreviews");
  if (!wrap) return;
  wrap.innerHTML = urls.map(url =>
    `<div class="img-preview-item">
       <img src="${url}" alt="" loading="lazy" onerror="this.style.opacity='0.2'" />
     </div>`
  ).join("");
}

async function saveProduct() {
  const name     = document.getElementById("fName").value.trim();
  const category = document.getElementById("fCategory").value;
  const price    = parseFloat(document.getElementById("fPrice").value);
  const oldPrice = parseFloat(document.getElementById("fOldPrice").value) || null;
  const stock    = parseInt(document.getElementById("fStock").value);
  const desc     = document.getElementById("fDesc").value.trim();
  const imgsRaw  = document.getElementById("fImages").value;
  const active   = document.getElementById("fActive").checked;
  const featured = document.getElementById("fFeatured").checked;
  const errEl    = document.getElementById("formError");

  // Validate
  if (!name || !category || isNaN(price) || isNaN(stock) || !desc) {
    errEl.textContent = "Completá todos los campos obligatorios (*)";
    return;
  }
  errEl.textContent = "";

  // Images
  const images = imgsRaw.split("\n").map(u => u.trim()).filter(Boolean);
  if (!images.length) images.push("https://via.placeholder.com/400x533/1a1a1a/333?text=VRTX");

  // Sizes
  const sizeInputs = document.querySelectorAll("#sizesCheckboxes input[type=checkbox]");
  const sizes = {};
  sizeInputs.forEach(cb => { sizes[cb.value] = cb.checked; });

  // Labels
  const labelInputs = document.querySelectorAll("#labelsCheckboxes input[type=checkbox]");
  const labels = [];
  labelInputs.forEach(cb => { if (cb.checked) labels.push(cb.value); });

  // Auto-add "Sin Stock" label
  if (stock === 0 && !labels.includes("Sin Stock")) labels.push("Sin Stock");
  if (stock > 0) { const i = labels.indexOf("Sin Stock"); if (i > -1) labels.splice(i, 1); }

  const products = await getProducts();

  if (editingId) {
    // Update existing
    const idx = products.findIndex(p => p.id === editingId);
    if (idx > -1) {
      products[idx] = { ...products[idx], name, category, price, oldPrice, stock, description: desc, images, sizes, labels, active, featured };
      await saveProducts(products);
      adminToast("✓ Producto actualizado", true);
    }
  } else {
    // New product
    const newProduct = {
      id: "prod_" + Date.now(),
      name, category, price, oldPrice, stock,
      description: desc,
      images, sizes, labels, active, featured
    };
    products.push(newProduct);
    await saveProducts(products);
    adminToast("✓ Producto agregado", true);
  }

  editingId = null;
  showView("products");
}

function editProduct(id) {
  editingId = id;
  showView("add");
}

function cancelEdit() {
  editingId = null;
  showView("products");
}

async function deleteProduct(id) {
  openConfirm("¿Eliminar este producto? Esta acción no se puede deshacer.", async () => {
    let products = await getProducts();
    products = products.filter(p => p.id !== id);
    await saveProducts(products);
    adminToast("Producto eliminado");
    await renderAdminProducts();
  });
}

async function toggleActive(id) {
  const products = await getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx < 0) return;
  products[idx].active = products[idx].active === false ? true : false;
  await saveProducts(products);
  adminToast(products[idx].active ? "Producto activado" : "Producto desactivado");
  await renderAdminProducts();
}

/* ──────────────────────────────────────────────────────────
   SETTINGS
────────────────────────────────────────────────────────── */
function loadSettings() {
  // Load current config into fields
  document.getElementById("sWA").value        = CONFIG.whatsappNumber || "";
  document.getElementById("sBrand").value     = CONFIG.brandName      || "";
  document.getElementById("sInstagram").value = CONFIG.instagram      || "";
}

function saveSettings() {
  const wa        = document.getElementById("sWA").value.trim();
  const brand     = document.getElementById("sBrand").value.trim();
  const instagram = document.getElementById("sInstagram").value.trim();

  // Persist in localStorage (overrides config.js defaults at runtime)
  const settings = { whatsappNumber: wa, brandName: brand, instagram };
  localStorage.setItem("vrtx_settings", JSON.stringify(settings));

  // Apply to running CONFIG
  if (wa)        CONFIG.whatsappNumber = wa;
  if (brand)     CONFIG.brandName     = brand;
  if (instagram) CONFIG.instagram     = instagram;

  adminToast("✓ Configuración guardada", true);
}

// Apply saved settings on load
function applySavedSettings() {
  try {
    const s = JSON.parse(localStorage.getItem("vrtx_settings") || "{}");
    if (s.whatsappNumber) CONFIG.whatsappNumber = s.whatsappNumber;
    if (s.brandName)      CONFIG.brandName      = s.brandName;
    if (s.instagram)      CONFIG.instagram      = s.instagram;
  } catch(e) {}
}
applySavedSettings();

function resetToSample() {
  openConfirm("¿Restaurar los productos de ejemplo? Se perderán todos los cambios.", async () => {
    localStorage.removeItem(CONFIG.storageKey);
    await initData();
    adminToast("✓ Productos de ejemplo restaurados", true);
    if (currentView === "products") await renderAdminProducts();
    if (currentView === "dashboard") await loadDashboard();
  });
}

function clearAllProducts() {
  openConfirm("¿Eliminar TODOS los productos? Esta acción es irreversible.", async () => {
    await saveProducts([]);
    adminToast("Todos los productos eliminados");
    if (currentView === "products") await renderAdminProducts();
    if (currentView === "dashboard") await loadDashboard();
  });
}

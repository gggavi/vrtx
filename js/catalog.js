/**
 * VRTX — CATALOG.JS
 * Renderiza el catálogo completo, tarjetas y modal de producto.
 */

/* ──────────────────────────────────────────────────────────
   HELPERS
────────────────────────────────────────────────────────── */
function formatPrice(n) {
  return "$" + Number(n).toLocaleString("es-AR");
}

function buildWALink(product, size = "") {
  const sizeText = size ? ` — Talle: ${size}` : "";
  const msg = encodeURIComponent(
    `Hola, me interesa este producto: ${product.name}${sizeText}. ¿Tienen disponibilidad?`
  );
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`;
}

function getLabelHTML(labels) {
  return (labels || [])
    .map(l => {
      let cls = "label-feat";
      if (l === "Nuevo")     cls = "label-new";
      if (l === "Hot")       cls = "label-hot";
      if (l === "Oferta")    cls = "label-sale";
      if (l === "Sin Stock") cls = "label-out";
      return `<span class="label ${cls}">${l}</span>`;
    })
    .join("");
}

function getStockStatus(product) {
  if (product.stock === 0) {
    return `<div class="stock-status out-stock"><span class="stock-dot"></span><span>Sin stock</span></div>`;
  }
  if (product.stock <= 5) {
    return `<div class="stock-status low-stock"><span class="stock-dot"></span><span>Últimas ${product.stock} unidades</span></div>`;
  }
  return `<div class="stock-status in-stock"><span class="stock-dot"></span><span>En stock</span></div>`;
}

function getSizesHTML(sizes) {
  return Object.entries(sizes)
    .map(([s, avail]) => `<span class="size-tag ${avail ? "" : "out"}">${s}</span>`)
    .join("");
}

/* ──────────────────────────────────────────────────────────
   PRODUCT CARD
────────────────────────────────────────────────────────── */
function buildCard(product) {
  const inStock  = product.stock > 0;
  const firstImg = product.images[0] || "https://via.placeholder.com/400x533?text=VRTX";
  const secondImg = product.images[1] || firstImg;
  const waLink   = buildWALink(product);
  const favs     = getFavorites();
  const isFav    = favs.includes(product.id);

  const dotsHTML = product.images.length > 1
    ? product.images.map((_, i) => `<span class="card-dot${i===0?" active":""}"></span>`).join("")
    : "";

  return `
  <article class="product-card reveal" data-id="${product.id}" data-category="${product.category}">
    <div class="card-img-wrap">
      <img
        src="${firstImg}"
        data-imgs='${JSON.stringify(product.images)}'
        data-current="0"
        alt="${product.name}"
        loading="lazy"
        onerror="this.src='https://via.placeholder.com/400x533/1a1a1a/333?text=VRTX'"
      />
      <div class="card-labels">${getLabelHTML(product.labels)}</div>
      <button class="btn-fav${isFav?" active":""}" data-id="${product.id}" aria-label="Favorito" onclick="toggleFav(event,'${product.id}')">
        <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      ${product.images.length > 1 ? `<div class="card-dots">${dotsHTML}</div>` : ""}
    </div>
    <div class="card-body">
      <div class="card-name">${product.name}</div>
      <div class="card-price">
        ${product.oldPrice ? `<span class="price-old">${formatPrice(product.oldPrice)}</span>` : ""}
        ${formatPrice(product.price)}
      </div>
      <div class="card-sizes">${getSizesHTML(product.sizes)}</div>
      ${getStockStatus(product)}
      ${inStock
        ? `<a class="btn-wa" href="${waLink}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
             <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
             Consultar
           </a>`
        : `<button class="btn-wa disabled">Sin Stock</button>`
      }
    </div>
  </article>`;
}

/* ──────────────────────────────────────────────────────────
   RENDER CATALOG
────────────────────────────────────────────────────────── */
function renderCatalog(products) {
  const container = document.getElementById("catalogContainer");
  if (!container) return;
  container.innerHTML = "";

  CONFIG.categories.forEach(cat => {
    const catProducts = products.filter(p => p.category === cat.id && p.active !== false);
    if (!catProducts.length) return;

    const section = document.createElement("section");
    section.className = "category-section";
    section.id = cat.id;
    section.innerHTML = `
      <div class="section-header">
        <h2 class="section-title reveal">${cat.label.toUpperCase()}</h2>
        <span class="section-count reveal">${catProducts.length} producto${catProducts.length !== 1 ? "s" : ""}</span>
      </div>
      <div class="products-grid stagger-children" id="grid-${cat.id}">
        ${catProducts.map(buildCard).join("")}
      </div>`;
    container.appendChild(section);
  });

  initReveal();
  initCardHover();
  updateFavBadge();
}

/* ──────────────────────────────────────────────────────────
   RENDER SEARCH RESULTS
────────────────────────────────────────────────────────── */
function renderSearchResults(products) {
  const section = document.getElementById("searchResults");
  const grid    = document.getElementById("searchGrid");
  const noRes   = document.getElementById("noResults");
  const catalog = document.getElementById("catalogContainer");
  const filters = document.getElementById("filtersBar");

  if (!section) return;

  if (products === null) {
    // Clear search
    section.style.display = "none";
    catalog.style.display = "";
    filters.style.display = "";
    return;
  }

  catalog.style.display = "none";
  filters.style.display = "none";
  section.style.display = "";

  if (!products.length) {
    grid.innerHTML = "";
    noRes.style.display = "";
    return;
  }

  noRes.style.display = "none";
  grid.innerHTML = products.map(buildCard).join("");
  initReveal();
  initCardHover();
}

/* ──────────────────────────────────────────────────────────
   PRODUCT MODAL
────────────────────────────────────────────────────────── */
async function openModal(productId) {
  const products = await getProducts();
  const p = products.find(x => x.id === productId);
  if (!p) return;

  const overlay = document.getElementById("modalOverlay");
  const content = document.getElementById("modalContent");
  const favs    = getFavorites();
  const isFav   = favs.includes(p.id);
  const inStock = p.stock > 0;

  // Build sizes HTML for modal
  const sizeBtns = Object.entries(p.sizes)
    .map(([s, avail]) =>
      `<button class="modal-size-btn${!avail?" out":""}" data-size="${s}" ${!avail?"disabled":""} onclick="selectSize(this)">${s}</button>`
    ).join("");

  const thumbs = p.images.map((img, i) =>
    `<div class="modal-thumb${i===0?" active":""}" data-img="${img}" onclick="switchModalImg(this, '${img}')">
       <img src="${img}" alt="" loading="lazy" onerror="this.src='https://via.placeholder.com/64x80/1a1a1a/333?text=?'" />
     </div>`
  ).join("");

  content.innerHTML = `
    <!-- Left: Carousel -->
    <div class="modal-carousel">
      <div class="modal-main-img">
        <img id="modalMainImg" src="${p.images[0]}" alt="${p.name}"
          onerror="this.src='https://via.placeholder.com/400x533/1a1a1a/333?text=VRTX'" />
      </div>
      <div class="modal-thumbs">${thumbs}</div>
    </div>

    <!-- Right: Info -->
    <div class="modal-info">
      <div class="modal-labels">${getLabelHTML(p.labels)}</div>
      <h2 class="modal-name">${p.name}</h2>
      <div class="modal-price">
        ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ""}
        ${formatPrice(p.price)}
      </div>
      <p class="modal-desc">${p.description}</p>
      ${getStockStatus(p)}
      <div class="modal-sizes-label">Seleccionar talle</div>
      <div class="modal-sizes" id="modalSizes">${sizeBtns}</div>
      <div class="modal-actions">
        ${inStock
          ? `<a id="modalWABtn" class="modal-btn-wa" href="${buildWALink(p)}" target="_blank" rel="noopener">
               <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
               Consultar por WhatsApp
             </a>`
          : `<button class="modal-btn-wa" style="background:var(--gray-700);pointer-events:none;">Sin Stock</button>`
        }
        <button class="modal-btn-fav${isFav?" active":""}" onclick="toggleFavModal('${p.id}', this)">
          <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="${isFav?"var(--red)":"none"}">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          ${isFav ? "Guardado en favoritos" : "Agregar a favoritos"}
        </button>
      </div>
    </div>`;

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";

  // Store product id for size selection
  overlay.dataset.productId = p.id;
}

function closeModal() {
  const overlay = document.getElementById("modalOverlay");
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

function switchModalImg(thumb, imgSrc) {
  document.getElementById("modalMainImg").src = imgSrc;
  document.querySelectorAll(".modal-thumb").forEach(t => t.classList.remove("active"));
  thumb.classList.add("active");
}

async function selectSize(btn) {
  if (btn.classList.contains("out")) return;
  document.querySelectorAll(".modal-size-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");

  const overlay = document.getElementById("modalOverlay");
  const productId = overlay.dataset.productId;
  const products = await getProducts();
  const p = products.find(x => x.id === productId);
  if (!p) return;

  const waBtn = document.getElementById("modalWABtn");
  if (waBtn) waBtn.href = buildWALink(p, btn.dataset.size);
}

/* ──────────────────────────────────────────────────────────
   FAVORITES
────────────────────────────────────────────────────────── */
function toggleFav(event, productId) {
  event.stopPropagation();
  let favs = getFavorites();
  const idx = favs.indexOf(productId);
  if (idx > -1) {
    favs.splice(idx, 1);
    showToast("Eliminado de favoritos");
  } else {
    favs.push(productId);
    showToast("❤ Agregado a favoritos", true);
  }
  saveFavorites(favs);
  updateFavBadge();

  // Update all fav buttons for this product
  document.querySelectorAll(`.btn-fav[data-id="${productId}"]`).forEach(btn => {
    const isFav = favs.includes(productId);
    btn.classList.toggle("active", isFav);
    const path = btn.querySelector("path");
    if (path) path.style.fill = isFav ? "var(--red)" : "none";
  });
}

function toggleFavModal(productId, btn) {
  let favs = getFavorites();
  const idx = favs.indexOf(productId);
  if (idx > -1) {
    favs.splice(idx, 1);
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      Agregar a favoritos`;
    showToast("Eliminado de favoritos");
  } else {
    favs.push(productId);
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="var(--red)">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      Guardado en favoritos`;
    showToast("❤ Agregado a favoritos", true);
  }
  saveFavorites(favs);
  updateFavBadge();

  // Sync card buttons
  document.querySelectorAll(`.btn-fav[data-id="${productId}"]`).forEach(b => {
    b.classList.toggle("active", favs.includes(productId));
  });
}

function updateFavBadge() {
  const favs  = getFavorites();
  const badge = document.getElementById("favCount");
  if (!badge) return;
  badge.textContent = favs.length;
  badge.style.display = favs.length > 0 ? "flex" : "none";
}

/* ──────────────────────────────────────────────────────────
   CARD HOVER IMAGE SWAP
────────────────────────────────────────────────────────── */
function initCardHover() {
  document.querySelectorAll(".card-img-wrap").forEach(wrap => {
    const img   = wrap.querySelector("img");
    const dots  = wrap.querySelectorAll(".card-dot");
    let imgs, timer, current = 0;

    try { imgs = JSON.parse(img.dataset.imgs || "[]"); } catch(e) { imgs = []; }
    if (imgs.length <= 1) return;

    function showImg(index) {
      current = index;
      img.src = imgs[index];
      dots.forEach((d, i) => d.classList.toggle("active", i === index));
    }

    wrap.addEventListener("mouseenter", () => {
      timer = setInterval(() => {
        showImg((current + 1) % imgs.length);
      }, 900);
    });

    wrap.addEventListener("mouseleave", () => {
      clearInterval(timer);
      showImg(0);
    });
  });
}

/* ──────────────────────────────────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
────────────────────────────────────────────────────────── */
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

/**
 * VRTX — UI.JS
 * Maneja: dark mode, toast, navbar scroll, modal, card clicks,
 * filtros de talle/precio/stock y barra de categorías.
 */

/* ──────────────────────────────────────────────────────────
   TOAST
────────────────────────────────────────────────────────── */
function showToast(msg, isSuccess = false) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.className   = "toast show" + (isSuccess ? " success" : "");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.className = "toast"; }, 2500);
}

/* ──────────────────────────────────────────────────────────
   DARK / LIGHT MODE
────────────────────────────────────────────────────────── */
function initDarkMode() {
  const toggle   = document.getElementById("darkModeToggle");
  const moonIcon = document.getElementById("moonIcon");
  const sunIcon  = document.getElementById("sunIcon");
  if (!toggle) return;

  const saved = localStorage.getItem("vrtx_theme");
  if (saved === "light") {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
    moonIcon.style.display = "none";
    sunIcon.style.display  = "";
  }

  toggle.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light-mode");
    if (isLight) {
      document.body.classList.replace("light-mode", "dark-mode");
      moonIcon.style.display = "";
      sunIcon.style.display  = "none";
      localStorage.setItem("vrtx_theme", "dark");
    } else {
      document.body.classList.replace("dark-mode", "light-mode");
      moonIcon.style.display = "none";
      sunIcon.style.display  = "";
      localStorage.setItem("vrtx_theme", "light");
    }
  });
}

/* ──────────────────────────────────────────────────────────
   NAVBAR — sticky scroll effect
────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  }, { passive: true });

  // Active category link on scroll
  const sections = document.querySelectorAll(".category-section");
  const catLinks = document.querySelectorAll(".cat-link");

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        catLinks.forEach(l => l.classList.toggle("active", l.dataset.cat === id));
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  sections.forEach(s => obs.observe(s));
}

/* ──────────────────────────────────────────────────────────
   MOBILE MENU
────────────────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger  = document.getElementById("hamburger");
  const closeMenu  = document.getElementById("closeMenu");
  const mobileMenu = document.getElementById("mobileMenu");
  const overlay    = document.getElementById("overlay");
  if (!hamburger) return;

  function openNav() {
    mobileMenu.classList.add("open");
    overlay.classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    mobileMenu.classList.remove("open");
    overlay.classList.remove("show");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", openNav);
  closeMenu.addEventListener("click", closeNav);
  overlay.addEventListener("click", closeNav);

  // Close on link click
  document.querySelectorAll(".mob-link").forEach(l =>
    l.addEventListener("click", closeNav)
  );
}

/* ──────────────────────────────────────────────────────────
   MODAL — open on card click
────────────────────────────────────────────────────────── */
function initModalTriggers() {
  // Close button
  const closeBtn = document.getElementById("modalClose");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  // Click outside modal
  const overlay = document.getElementById("modalOverlay");
  if (overlay) overlay.addEventListener("click", e => {
    if (e.target === overlay) closeModal();
  });

  // ESC key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });

  // Delegate card clicks (re-init after render)
  document.addEventListener("click", e => {
    const card = e.target.closest(".product-card");
    if (!card) return;
    if (e.target.closest(".btn-fav") || e.target.closest(".btn-wa")) return;
    openModal(card.dataset.id);
  });
}

/* ──────────────────────────────────────────────────────────
   FILTERS — talle, precio, stock
────────────────────────────────────────────────────────── */
let activeFilters = {
  size:  "all",
  price: 100000,
  stock: "all",
};

function initFilters() {
  // Size buttons
  const sizeFilters = document.getElementById("sizeFilters");
  if (sizeFilters) {
    sizeFilters.addEventListener("click", e => {
      const btn = e.target.closest(".size-btn");
      if (!btn) return;
      sizeFilters.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilters.size = btn.dataset.size;
      applyFilters();
    });
  }

  // Price range
  const priceRange = document.getElementById("priceRange");
  const priceVal   = document.getElementById("priceVal");
  if (priceRange) {
    priceRange.addEventListener("input", () => {
      const v = parseInt(priceRange.value);
      activeFilters.price = v;
      priceVal.textContent = "$" + v.toLocaleString("es-AR");
      applyFilters();
    });
  }

  // Stock select
  const stockFilter = document.getElementById("stockFilter");
  if (stockFilter) {
    stockFilter.addEventListener("change", () => {
      activeFilters.stock = stockFilter.value;
      applyFilters();
    });
  }

  // Reset
  const resetBtn = document.getElementById("resetFilters");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetFilters);
  }
}

function resetFilters() {
  activeFilters = { size: "all", price: 100000, stock: "all" };

  const sizeFilters = document.getElementById("sizeFilters");
  if (sizeFilters) {
    sizeFilters.querySelectorAll(".size-btn").forEach(b =>
      b.classList.toggle("active", b.dataset.size === "all")
    );
  }
  const priceRange = document.getElementById("priceRange");
  const priceVal   = document.getElementById("priceVal");
  if (priceRange) {
    priceRange.value        = 100000;
    priceVal.textContent    = "$100.000";
  }
  const stockFilter = document.getElementById("stockFilter");
  if (stockFilter) stockFilter.value = "all";

  applyFilters();
}

async function applyFilters() {
  const products = await getProducts();

  const filtered = products.filter(p => {
    if (!p.active) return false;

    // Price
    if (p.price > activeFilters.price) return false;

    // Stock
    if (activeFilters.stock === "instock"  && p.stock === 0) return false;
    if (activeFilters.stock === "outstock" && p.stock > 0)  return false;

    // Size
    if (activeFilters.size !== "all") {
      const sizeAvail = p.sizes && p.sizes[activeFilters.size];
      if (!sizeAvail) return false;
    }

    return true;
  });

  renderCatalog(filtered);
}

/* ──────────────────────────────────────────────────────────
   FOOTER WhatsApp link
────────────────────────────────────────────────────────── */
function initFooter() {
  const waLink = document.getElementById("footerWA");
  if (waLink) {
    waLink.href = `https://wa.me/${CONFIG.whatsappNumber}`;
    waLink.textContent = `+${CONFIG.whatsappNumber}`;
  }
}

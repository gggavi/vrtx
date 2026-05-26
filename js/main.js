/**
 * VRTX — MAIN.JS
 * Entry point: inicializa todo cuando el DOM está listo.
 * Versión async para compatibilidad con JSONBin backend.
 */

document.addEventListener("DOMContentLoaded", async () => {

  /* ── 1. Inicializar datos (async: carga JSONBin o muestra) ─ */
  await initData();

  /* ── 2. Loader ─────────────────────────────────────────── */
  const loader = document.getElementById("loader");
  if (loader) {
    const bar = loader.querySelector(".loader-bar span");
    let w = 0;
    const tick = setInterval(() => {
      w = Math.min(w + Math.random() * 18, 95);
      if (bar) bar.style.width = w + "%";
    }, 120);

    window.addEventListener("load", () => {
      clearInterval(tick);
      if (bar) bar.style.width = "100%";
      setTimeout(() => loader.classList.add("hidden"), 400);
    });

    setTimeout(() => loader.classList.add("hidden"), 3000);
  }

  /* ── 3. Render catalog ─────────────────────────────────── */
  const products = await getProducts();
  renderCatalog(products);

  /* ── 4. Init UI modules ────────────────────────────────── */
  initDarkMode();
  initNavbar();
  initMobileMenu();
  initModalTriggers();
  initFilters();
  initFooter();
  updateFavBadge();

  /* ── 5. Hero scroll indicator ──────────────────────────── */
  const scrollIndicator = document.querySelector(".hero-scroll");
  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", () => {
      document.getElementById("filtersBar")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ── 6. Search ─────────────────────────────────────────── */
  const searchInput = document.getElementById("searchInput");
  const searchBtn   = document.querySelector(".search-btn");
  let searchDebounce;

  async function doSearch(query) {
    const q = (query || "").trim().toLowerCase();
    if (!q) { renderSearchResults(null); return; }
    const all = await getProducts();
    const results = all.filter(p =>
      p.active !== false && (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.labels || []).some(l => l.toLowerCase().includes(q))
      )
    );
    renderSearchResults(results);
  }

  if (searchInput) {
    searchInput.addEventListener("input", e => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => doSearch(e.target.value), 280);
    });
    searchInput.addEventListener("keydown", e => {
      if (e.key === "Enter") { clearTimeout(searchDebounce); doSearch(e.target.value); }
      if (e.key === "Escape") { searchInput.value = ""; renderSearchResults(null); }
    });
  }
  if (searchBtn) searchBtn.addEventListener("click", () => doSearch(searchInput?.value));

  /* ── 7. Favorites ──────────────────────────────────────── */
  const favBtn = document.getElementById("favBtn");
  if (favBtn) {
    favBtn.addEventListener("click", async () => {
      const favs     = getFavorites();
      const all      = await getProducts();
      const favProds = all.filter(p => favs.includes(p.id) && p.active !== false);
      if (!favProds.length) { showToast("No tenés productos en favoritos"); return; }
      renderSearchResults(favProds);
      const title = document.querySelector("#searchResults .section-title");
      if (title) title.textContent = "Mis Favoritos";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ── 8. Category smooth scroll ─────────────────────────── */
  document.querySelectorAll(".cat-link, .mob-link").forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - 110;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    });
  });

});

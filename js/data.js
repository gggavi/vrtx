/**
 * VRTX — DATA.JS
 * Productos de ejemplo. El panel Admin los gestiona en localStorage.
 * Las imágenes de muestra usan via.placeholder.com — reemplazalas con las tuyas.
 */

const SAMPLE_PRODUCTS = [
  // ─── REMERAS ─────────────────────────────────────────────
  {
    id: "r001",
    name: "Remera VRTX Core",
    category: "remeras",
    price: 18500,
    oldPrice: null,
    description: "Remera oversize de algodón premium 220g. Serigrafía de alta calidad con tintas reactivas. Cuello redondo reforzado y costuras dobles en mangas y dobladillo.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80"
    ],
    sizes: { XS: true, S: true, M: true, L: true, XL: true, XXL: false },
    stock: 24,
    labels: ["Nuevo"],
    active: true,
    featured: true
  },
  {
    id: "r002",
    name: "Tee VRTX Distressed",
    category: "remeras",
    price: 22000,
    oldPrice: 27000,
    description: "Remera de algodón lavado con efecto envejecido. Gráfico frontal distressed exclusivo. Corte regular.",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80"
    ],
    sizes: { XS: false, S: true, M: true, L: true, XL: false, XXL: false },
    stock: 8,
    labels: ["Oferta","Hot"],
    active: true,
    featured: false
  },
  {
    id: "r003",
    name: "Tee Street Block",
    category: "remeras",
    price: 16500,
    oldPrice: null,
    description: "Remera slim fit con estampado tipográfico. 100% algodón peinado. Disponible en talle grande.",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80"
    ],
    sizes: { XS: true, S: true, M: true, L: true, XL: true, XXL: true },
    stock: 0,
    labels: ["Sin Stock"],
    active: true,
    featured: false
  },
  {
    id: "r004",
    name: "Remera Premium Blanc",
    category: "remeras",
    price: 24500,
    oldPrice: null,
    description: "Remera minimalista en blanco. Bordado tonal en pecho. Tela PIMA algodón 240g. La pieza esencial del guardarropa urbano.",
    images: [
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600&q=80",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80"
    ],
    sizes: { XS: true, S: true, M: true, L: true, XL: true, XXL: false },
    stock: 15,
    labels: ["Exclusivo"],
    active: true,
    featured: true
  },

  // ─── PANTALONES ──────────────────────────────────────────
  {
    id: "p001",
    name: "Cargo VRTX Urban",
    category: "pantalones",
    price: 52000,
    oldPrice: null,
    description: "Pantalón cargo de gabardina resistente. Bolsillos utilitarios, cintura elástica lateral y trabillas reforzadas. El clásico urbano redefinido.",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80"
    ],
    sizes: { "38": true, "40": true, "42": true, "44": true, "46": true, "48": false },
    stock: 12,
    labels: ["Nuevo","Hot"],
    active: true,
    featured: true
  },
  {
    id: "p002",
    name: "Jean Relaxed Fit",
    category: "pantalones",
    price: 48000,
    oldPrice: 58000,
    description: "Jean de corte relaxed con lavado medio. Tiro alto, pierna recta. Denim 12oz premium con 2% elastane para mayor comodidad.",
    images: [
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&q=80",
      "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80"
    ],
    sizes: { "38": true, "40": true, "42": true, "44": true, "46": false, "48": false },
    stock: 7,
    labels: ["Oferta"],
    active: true,
    featured: false
  },
  {
    id: "p003",
    name: "Jogger Nylon Tech",
    category: "pantalones",
    price: 44000,
    oldPrice: null,
    description: "Jogger de nylon técnico con elástico en tobillo. Bolsillos con cierre. Corte moderno para el día a día.",
    images: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80"
    ],
    sizes: { "38": true, "40": true, "42": true, "44": true, "46": true, "48": true },
    stock: 20,
    labels: [],
    active: true,
    featured: false
  },

  // ─── BUZOS ───────────────────────────────────────────────
  {
    id: "b001",
    name: "Hoodie VRTX Heavy",
    category: "buzos",
    price: 58000,
    oldPrice: null,
    description: "Hoodie oversize de felpa francesa 400g. Canguro frontal, cordón plano y puños acanalados. La pieza estrella de la temporada.",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&q=80"
    ],
    sizes: { XS: false, S: true, M: true, L: true, XL: true, XXL: true },
    stock: 18,
    labels: ["Nuevo","Hot"],
    active: true,
    featured: true
  },
  {
    id: "b002",
    name: "Buzo Crewneck Essentials",
    category: "buzos",
    price: 46000,
    oldPrice: null,
    description: "Buzo cuello redondo de algodón fleece. Bordado mínimo en pecho. Fit regular. Esencial en cualquier look urbano.",
    images: [
      "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600&q=80",
      "https://images.unsplash.com/photo-1613852348851-df1739db8201?w=600&q=80"
    ],
    sizes: { XS: true, S: true, M: true, L: true, XL: true, XXL: false },
    stock: 5,
    labels: ["Limitado"],
    active: true,
    featured: false
  },
  {
    id: "b003",
    name: "Zip Hoodie Tactical",
    category: "buzos",
    price: 64000,
    oldPrice: 72000,
    description: "Hoodie con cierre full. Doble bolsillo interior. Material técnico anti-pilling. Ideal para el uso diario exigente.",
    images: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80",
      "https://images.unsplash.com/photo-1611765083444-a97a7bdea6a0?w=600&q=80"
    ],
    sizes: { XS: true, S: true, M: true, L: false, XL: false, XXL: false },
    stock: 3,
    labels: ["Oferta","Limitado"],
    active: true,
    featured: false
  },

  // ─── CAMPERAS ────────────────────────────────────────────
  {
    id: "c001",
    name: "Bomber VRTX Signature",
    category: "camperas",
    price: 98000,
    oldPrice: null,
    description: "Bomber de tafetán premium con interior acolchado. Ribetes acanalados en cuello, puños y dobladillo. Logo bordado en pecho y espalda. La pieza insignia de VRTX.",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
      "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&q=80",
      "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=600&q=80"
    ],
    sizes: { XS: false, S: true, M: true, L: true, XL: true, XXL: false },
    stock: 10,
    labels: ["Nuevo","Exclusivo"],
    active: true,
    featured: true
  },
  {
    id: "c002",
    name: "Anorak Nylon Shield",
    category: "camperas",
    price: 85000,
    oldPrice: 95000,
    description: "Anorak de nylon ripstop impermeabilizado. Capucha con cordón, bolsillos cargo y drawstring en cintura. Funcional y estético.",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80",
      "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&q=80"
    ],
    sizes: { XS: true, S: true, M: true, L: true, XL: true, XXL: true },
    stock: 14,
    labels: ["Oferta"],
    active: true,
    featured: false
  },
  {
    id: "c003",
    name: "Puffer Street",
    category: "camperas",
    price: 112000,
    oldPrice: null,
    description: "Campera puffer con relleno de fibra sintética reciclada. Diseño boxy, capucha removible. La máxima expresión del streetwear invernal.",
    images: [
      "https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"
    ],
    sizes: { XS: false, S: false, M: true, L: true, XL: true, XXL: true },
    stock: 0,
    labels: ["Sin Stock"],
    active: true,
    featured: false
  },

  // ─── ACCESORIOS ──────────────────────────────────────────
  {
    id: "a001",
    name: "Cap VRTX 6-Panel",
    category: "accesorios",
    price: 22000,
    oldPrice: null,
    description: "Gorra de 6 paneles en twill de algodón. Logo bordado frontal. Cierre de hebilla metálica. Talla única ajustable.",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80"
    ],
    sizes: { Único: true },
    stock: 35,
    labels: ["Nuevo"],
    active: true,
    featured: false
  },
  {
    id: "a002",
    name: "Balaclava VRTX Knit",
    category: "accesorios",
    price: 18500,
    oldPrice: null,
    description: "Balaclava de punto de lana acrílica. Diseño urban ninja. Usable como gorro o cuello. Colección invierno 2025.",
    images: [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80",
      "https://images.unsplash.com/photo-1617634754976-e6edd7d9765c?w=600&q=80"
    ],
    sizes: { Único: true },
    stock: 20,
    labels: ["Hot"],
    active: true,
    featured: true
  },
  {
    id: "a003",
    name: "Bag Crossbody Tactical",
    category: "accesorios",
    price: 34000,
    oldPrice: 42000,
    description: "Bolso crossbody de nylon con múltiples compartimentos. Correa ajustable, hebillas de aluminio. Capacidad 3L.",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"
    ],
    sizes: { Único: true },
    stock: 8,
    labels: ["Oferta"],
    active: true,
    featured: false
  },

  // ─── OUTFITS ─────────────────────────────────────────────
  {
    id: "o001",
    name: "Outfit Urban Monochrome",
    category: "outfits",
    price: 128000,
    oldPrice: 148000,
    description: "Conjunto completo: Hoodie VRTX Heavy + Jogger Nylon Tech + Cap 6-Panel. Look monocromático negro total. Precio especial de conjunto.",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80"
    ],
    sizes: { XS: true, S: true, M: true, L: true, XL: true, XXL: false },
    stock: 6,
    labels: ["Nuevo","Oferta"],
    active: true,
    featured: true
  },
  {
    id: "o002",
    name: "Outfit Winter Bomber",
    category: "outfits",
    price: 165000,
    oldPrice: null,
    description: "Conjunto premium: Bomber VRTX Signature + Jean Relaxed Fit + Tee VRTX Core. El look de temporada definitivo.",
    images: [
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80"
    ],
    sizes: { XS: false, S: true, M: true, L: true, XL: true, XXL: false },
    stock: 4,
    labels: ["Exclusivo","Hot"],
    active: true,
    featured: true
  },
];

/**
 * ─── JSONBIN BACKEND ──────────────────────────────────────
 * Los productos se guardan en la nube via JSONBin.io
 */
const JSONBIN_ID  = "6a15f7cc3f632058588a20c1";
const JSONBIN_KEY = "$2a$10$MjIYes6fATKHF6b3LFyiD.D85I4RGjjniB.2L1nN9mAUJhiYWqEVu";
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_ID}`;

// Cache local para no hacer fetch en cada llamada
let _productsCache = null;

async function initData() {
  try {
    const products = await getProducts();
    // Si el bin está vacío, cargá los productos de muestra
    if (!products || products.length === 0) {
      await saveProducts(SAMPLE_PRODUCTS);
      _productsCache = SAMPLE_PRODUCTS;
    }
  } catch(e) {
    console.warn("JSONBin no disponible, usando localStorage como fallback.", e);
    const stored = localStorage.getItem(CONFIG.storageKey);
    if (!stored) localStorage.setItem(CONFIG.storageKey, JSON.stringify(SAMPLE_PRODUCTS));
  }
}

async function getProducts() {
  if (_productsCache) return _productsCache;
  try {
    const res  = await fetch(JSONBIN_URL + "/latest", {
      headers: { "X-Master-Key": JSONBIN_KEY }
    });
    const data = await res.json();
    _productsCache = data.record.products || [];
    return _productsCache;
  } catch(e) {
    console.warn("Error leyendo JSONBin, usando localStorage.", e);
    const stored = localStorage.getItem(CONFIG.storageKey);
    return stored ? JSON.parse(stored) : SAMPLE_PRODUCTS;
  }
}

async function saveProducts(products) {
  _productsCache = products;
  try {
    await fetch(JSONBIN_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": JSONBIN_KEY
      },
      body: JSON.stringify({ products })
    });
    // Backup local también
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(products));
  } catch(e) {
    console.warn("Error guardando en JSONBin, guardado solo en localStorage.", e);
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(products));
  }
}

function getFavorites() {
  try {
    const stored = localStorage.getItem(CONFIG.favKey);
    return stored ? JSON.parse(stored) : [];
  } catch(e) { return []; }
}

function saveFavorites(favs) {
  localStorage.setItem(CONFIG.favKey, JSON.stringify(favs));
}

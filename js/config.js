/**
 * VRTX — CONFIG.JS
 * Configuración global. Cambiá el número de WhatsApp aquí.
 */

const CONFIG = {
  // ─── WHATSAPP ──────────────────────────────────────────────
  // Formato internacional sin + ni espacios. Ej: Argentina → 549xxxxxxxxxx
  whatsappNumber: "5493447460703",

  // ─── MARCA ────────────────────────────────────────────────
  brandName: "KUBA SUEDE",
  tagline: "Vestite Autentico",
  instagram: "@kubasuede",

  // ─── ADMIN ────────────────────────────────────────────────
  adminUser: "admin",
  adminPass: "vrtx2025",   // Cambiá esto antes de publicar

  // ─── STORAGE ──────────────────────────────────────────────
  // Clave en localStorage donde se guardan los productos
  storageKey: "vrtx_products",
  favKey:     "vrtx_favorites",

  // ─── CATEGORÍAS ───────────────────────────────────────────
  categories: [
    { id: "remeras",    label: "Remeras",    sizes: ["XS","S","M","L","XL","XXL"] },
    { id: "pantalones", label: "Pantalones", sizes: ["38","40","42","44","46","48"] },
    { id: "buzos",      label: "Buzos",      sizes: ["XS","S","M","L","XL","XXL"] },
    { id: "camperas",   label: "Camperas",   sizes: ["XS","S","M","L","XL","XXL"] },
    { id: "VARIOS", label: "VARIOS", sizes: ["Único"] },
    { id: "outfits",    label: "Outfits",    sizes: ["XS","S","M","L","XL","XXL"] },
  ],

  // ─── ETIQUETAS ────────────────────────────────────────────
  labels: ["Nuevo","Hot","Oferta","Sin Stock","Destacado","Exclusivo","Limitado"],
};

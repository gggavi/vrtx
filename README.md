# VRTX — Catálogo de Ropa Urbana Premium

Catálogo web moderno para tienda de ropa, con panel de administración completo. Construido con HTML + CSS + JavaScript vanilla. Compatible con GitHub Pages.

---

## Estructura del proyecto

```
vrtx/
├── index.html              ← Catálogo principal
├── css/
│   ├── styles.css          ← Estilos principales
│   └── animations.css      ← Animaciones y transiciones
├── js/
│   ├── config.js           ← Configuración (WhatsApp, categorías)
│   ├── data.js             ← Productos de ejemplo + funciones CRUD
│   ├── catalog.js          ← Renderizado de tarjetas y modal
│   ├── ui.js               ← Dark mode, filtros, navbar, toast
│   └── main.js             ← Entry point: inicialización y búsqueda
├── admin/
│   ├── index.html          ← Panel de administración
│   ├── style.css           ← Estilos del admin
│   └── admin.js            ← Lógica del admin
├── assets/                 ← Imágenes propias (opcional)
├── database/               ← Placeholder para integraciones backend
└── README.md
```

---

## Inicio rápido

1. Abrí `index.html` en tu navegador — funciona sin servidor.
2. Para acceder al admin, andá a `admin/index.html`.
3. Usuario por defecto: **admin** / Contraseña: **vrtx2025**

> ⚠️ Cambiá la contraseña en `js/config.js` antes de publicar.

---

## Configurar WhatsApp

Editá `js/config.js`:

```js
const CONFIG = {
  whatsappNumber: "5491112345678", // tu número sin + ni espacios
  // ...
};
```

Formato: código de país + código de área sin 0 + número.  
**Argentina:** `549` + `11` + `xxxxxxxx` = `5491112345678`

---

## Subir a GitHub Pages

1. Creá un repositorio en GitHub (público).
2. Subí todos los archivos.
3. En el repo → **Settings → Pages → Source: main branch → / (root)**.
4. Tu tienda estará en `https://tuusuario.github.io/nombre-repo/`

> Las imágenes de productos y el storage de productos usan `localStorage`, por lo que funcionan perfectamente en GitHub Pages.

---

## Panel Admin

Accedé en `/admin/index.html`. Funciones disponibles:

| Función | Descripción |
|---|---|
| Dashboard | Estadísticas, productos por categoría, últimos agregados |
| Gestión de productos | Listar, buscar, filtrar por categoría |
| Agregar/Editar | Nombre, precio, imágenes, talles, etiquetas, stock, destacado |
| Activar/Desactivar | Ocultar producto sin eliminarlo |
| Configuración | Número de WhatsApp, nombre de marca, Instagram |
| Restaurar datos | Volver a los productos de ejemplo |

Los productos se guardan en `localStorage` del navegador. Para persistencia entre dispositivos, ver sección JSONBIN abajo.

---

## Conectar JSONBin como backend (opcional)

[JSONBin.io](https://jsonbin.io) es un servicio gratuito de almacenamiento JSON en la nube — ideal para proyectos sin servidor.

### Paso 1: Crear cuenta y bin

1. Creá una cuenta en https://jsonbin.io
2. Creá un nuevo **Bin** con este JSON inicial:

```json
{ "products": [] }
```

3. Copiá el **Bin ID** (algo como `64abc123...`) y tu **API Key**.

### Paso 2: Reemplazar funciones de storage en `js/data.js`

Al final del archivo, reemplazá `getProducts()` y `saveProducts()`:

```js
const JSONBIN_ID  = "TU_BIN_ID";
const JSONBIN_KEY = "TU_API_KEY";
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_ID}`;

async function getProducts() {
  const res  = await fetch(JSONBIN_URL + "/latest", {
    headers: { "X-Master-Key": JSONBIN_KEY }
  });
  const data = await res.json();
  return data.record.products || [];
}

async function saveProducts(products) {
  await fetch(JSONBIN_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": JSONBIN_KEY
    },
    body: JSON.stringify({ products })
  });
}
```

> **Nota:** con esta integración el catálogo y el admin funcionan en tiempo real desde cualquier dispositivo.

---

## Imágenes de productos

Podés usar:

- **Cloudinary** (gratuito, recomendado): https://cloudinary.com → subí tus fotos y usá las URLs.
- **Imgur**: https://imgur.com → arrastrá imágenes y copiá el link directo.
- **GitHub**: subí las fotos a la carpeta `/assets/` del repo y usá la URL raw de GitHub.

En el admin, al editar un producto, pegá las URLs de imágenes (una por línea) en el campo correspondiente.

---

## Personalización rápida

### Cambiar colores principales

En `css/styles.css`:

```css
:root {
  --red:     #ff0000;  /* Color de acento principal */
  --black:   #000000;  /* Fondo */
}
```

### Agregar categorías

En `js/config.js`:

```js
categories: [
  { id: "nuevacategoria", label: "Mi Categoría", sizes: ["XS","S","M","L"] },
  // ...
]
```

### Cambiar credenciales del admin

En `js/config.js`:

```js
adminUser: "miusuario",
adminPass: "mipassword2025",
```

---

## Créditos y tecnologías

- Fuentes: [Bebas Neue](https://fonts.google.com/specimen/Bebas+Neue) + [DM Sans](https://fonts.google.com/specimen/DM+Sans) via Google Fonts
- Imágenes de ejemplo: [Unsplash](https://unsplash.com)
- Sin frameworks, sin dependencias — HTML + CSS + JS vanilla puro

---

© 2025 VRTX. Todos los derechos reservados.

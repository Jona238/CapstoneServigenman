# 📋 GUÍA DE USO - SISTEMA UNIFICADO DE DISEÑO DE TARJETAS

## 🎯 Introducción

Se ha implementado un sistema unificado de CSS variables y clases reutilizables para estandarizar el diseño de todas las tarjetas/cards en la aplicación. Este sistema:

✅ Mantiene soporte completo para **Light Mode** y **Dark Mode**
✅ Preserva los **backgrounds especializados** de cada página
✅ Proporciona **breakpoints estandarizados** (5 en lugar de 15+)
✅ Unifica **border-radius**, **padding**, **shadows** y **gaps**
✅ Es **totalmente responsive** y mobile-first

---

## 📁 Archivos del Sistema

### 1. `styles/variables.css`
Define todas las variables CSS globales:
- **Border radius**: `--card-radius-sm` (12px) a `--card-radius-xl` (24px)
- **Padding**: `--card-padding-xs` a `--card-padding-2xl`
- **Box shadows**: `--card-shadow-sm/md/lg` y sus variantes dark
- **Backdrop filter**: `--card-backdrop` (blur 16px)
- **Gaps**: `--card-gap-sm` a `--card-gap-xl`
- **Colores base**: Para light y dark mode

### 2. `styles/cards.css`
Clases reutilizables:
- `.card` - Clase base para todas las tarjetas
- `.card-radius-*` - Variantes de border-radius
- `.card-padding-*` - Variantes de padding
- `.card-shadow-*` - Variantes de sombra
- `.card-gap-*` - Variantes de espaciado
- `.card-sm/lg/xl` - Tamaños predefinidos
- `.card-danger/success/warning` - Estados
- `.card-grid` - Grid responsivo de tarjetas

### 3. `styles/responsive.css`
Breakpoints y utilidades responsive:
- Breakpoints: `374px`, `375px-479px`, `480px-767px`, `768px-1023px`, `1024px-1439px`, `1440px+`
- Clases de utilidad: `.show-mobile`, `.hide-tablet`, etc.
- Containers responsivos
- Typography responsiva
- Padding y gap responsivos

### 4. `globals.css`
Archivo principal que importa todo el sistema

---

## 🎨 CÓMO USAR EN NUEVAS TARJETAS

### Opción 1: Usar la clase base `.card`

```html
<div class="card">
  <div class="card-header">
    <h2>Título de la Tarjeta</h2>
    <p>Descripción</p>
  </div>
  <div class="card-body">
    <!-- Contenido -->
  </div>
</div>
```

### Opción 2: Personalizar con clases

```html
<div class="card card-xl card-shadow-lg card-hover">
  <!-- Contenido -->
</div>
```

### Opción 3: Mantener clases específicas de página

```html
<!-- Inventario -->
<div class="inventory-card">
  <!-- Ya usa variables globales -->
</div>

<!-- Categorías -->
<div class="category-card">
  <!-- Ya usa variables globales -->
</div>
```

---

## 📱 BREAKPOINTS ESTANDARIZADOS

```css
/* XS: Extra Small (320px - 374px) */
/* SM: Small (375px - 479px) */
/* MD: Mobile/Tablet Pequeño (480px - 767px) */
/* LG: Tablet (768px - 1023px) */
/* XL: Laptop (1024px - 1439px) */
/* 2XL: Desktop (1440px+) */
```

### Usar en media queries:

```css
/* Mobile first - comenzar con base, añadir conforme crece */
.mi-card {
  padding: var(--card-padding-sm);
}

@media (min-width: 768px) {
  .mi-card {
    padding: var(--card-padding-lg);
  }
}

@media (min-width: 1024px) {
  .mi-card {
    padding: var(--card-padding-xl);
  }
}
```

---

## 🎨 VARIABLES CSS POR CATEGORÍA

### Border Radius
```css
--card-radius-sm: 12px;    /* buttons, badges */
--card-radius-md: 16px;    /* tarjetas normales */
--card-radius-lg: 20px;    /* tarjetas principales */
--card-radius-xl: 24px;    /* contenedores hero */
```

### Padding
```css
--card-padding-xs:  12px 14px;    /* mobile xs */
--card-padding-sm:  16px 18px;    /* mobile sm */
--card-padding-md:  24px;         /* tablet */
--card-padding-lg:  28px;         /* tablet grande */
--card-padding-xl:  32px;         /* laptop */
--card-padding-2xl: 36px;         /* desktop */
```

### Box Shadow (Light Mode)
```css
--card-shadow-sm:  0 12px 24px rgba(18, 43, 72, 0.12);
--card-shadow-md:  0 20px 40px rgba(18, 43, 72, 0.18);
--card-shadow-lg:  0 28px 60px rgba(18, 43, 72, 0.25);
```

### Box Shadow (Dark Mode)
```css
--card-shadow-dark-sm:  0 12px 24px rgba(0, 0, 0, 0.28);
--card-shadow-dark-md:  0 24px 50px rgba(0, 0, 0, 0.45);
--card-shadow-dark-lg:  0 28px 70px rgba(0, 0, 0, 0.55);
```

### Gap (Espaciado interno)
```css
--card-gap-sm: 12px;    /* mobile */
--card-gap-md: 16px;    /* tablet */
--card-gap-lg: 24px;    /* desktop */
--card-gap-xl: 32px;    /* desktop xl */
```

### Colores
```css
--card-background:        rgba(255, 255, 255, 0.95);  /* light */
--card-border:           rgba(32, 110, 190, 0.2);
--card-text:             #10253e;
--card-muted:            #56677f;
--card-surface-secondary: rgba(245, 250, 255, 0.9);
--card-divider:          rgba(30, 110, 190, 0.18);
--card-accent:           linear-gradient(135deg, #2e78ff, #1ac6ff);
--card-danger:           #d65c5c;
--card-success:          #1f9d77;
```

En **Dark Mode** (`prefers-color-scheme: dark` o `body[data-theme="dark"]`):
- Los colores se ajustan automáticamente
- Las sombras se oscurecen
- El contraste se mantiene

---

## ✅ PÁGINAS YA MIGRADAS

✅ **Inventario** - Usa `--card-radius-xl`, `--card-padding-xl`, `--card-gap-xl`
✅ **Categorías** - Usa `--card-radius-xl` para hero, `--card-backdrop-light` para cards
✅ **Presupuesto** - Usa `--card-radius-xl` para wrap, `--card-radius-md` para KPIs

---

## 🔄 MIGRAR UNA PÁGINA EXISTENTE

### Paso 1: Identificar tarjetas principales

```css
/* ANTES */
.mi-pagina-card {
  border-radius: 18px;
  padding: 26px;
  box-shadow: 0 18px 42px rgba(18, 43, 72, 0.16);
  backdrop-filter: blur(16px);
}
```

### Paso 2: Reemplazar con variables

```css
/* DESPUÉS */
.mi-pagina-card {
  border-radius: var(--card-radius-lg);
  padding: var(--card-padding-xl);
  box-shadow: var(--card-shadow-md);
  backdrop-filter: var(--card-backdrop);
}
```

### Paso 3: Actualizar responsive

```css
/* ANTES */
@media (max-width: 900px) {
  .mi-pagina-card {
    padding: 22px;
  }
}

/* DESPUÉS */
@media (max-width: 1023px) {
  .mi-pagina-card {
    padding: var(--card-padding-lg);
  }
}

@media (max-width: 767px) {
  .mi-pagina-card {
    padding: var(--card-padding-md);
  }
}
```

### Paso 4: Inspeccionar y ajustar si es necesario

Si la página requiere sombras o colores específicos, se pueden mantener pero deben usar variables CSS:

```css
:root {
  --mi-pagina-shadow: var(--card-shadow-lg);
  --mi-pagina-background: var(--card-background);
}

body[data-theme="dark"] {
  --mi-pagina-shadow: var(--card-shadow-dark-lg);
  /* backgrounds se heredan automáticamente */
}
```

---

## 🎯 MEJORES PRÁCTICAS

### ✅ Hacer:

1. **Usar variables en lugar de valores hardcodeados**
   ```css
   border-radius: var(--card-radius-lg);  ✅
   border-radius: 20px;                   ❌
   ```

2. **Mantener la estructura responsive mobile-first**
   ```css
   padding: var(--card-padding-sm);

   @media (min-width: 768px) {
     padding: var(--card-padding-lg);
   }
   ```

3. **Respetar los breakpoints estandarizados**
   ```css
   @media (max-width: 374px) { }    /* XS */
   @media (min-width: 375px) { }    /* SM */
   @media (min-width: 480px) { }    /* MD */
   @media (min-width: 768px) { }    /* LG */
   @media (min-width: 1024px) { }   /* XL */
   @media (min-width: 1440px) { }   /* 2XL */
   ```

### ❌ Evitar:

1. **Hardcoded values**
   ```css
   padding: 24px;      ❌
   border-radius: 20px;❌
   ```

2. **Breakpoints inconsistentes**
   ```css
   @media (max-width: 900px) { }   ❌
   @media (max-width: 640px) { }   ❌
   ```

3. **Duplicar estilos entre páginas**
   ```css
   .inventario-card {
     border-radius: 24px;
     padding: 26px;
   }

   .categoria-card {
     border-radius: 24px;  /* duplicado */
     padding: 26px;        /* duplicado */
   }
   ```

---

## 🌓 SOPORTE PARA DARK MODE

El sistema **detecta automáticamente** dark mode de dos formas:

### Método 1: `prefers-color-scheme` (nativo del navegador)
```css
@media (prefers-color-scheme: dark) {
  /* Valores oscuros se aplican automáticamente */
}
```

### Método 2: `body[data-theme="dark"]` (toggle manual)
```html
<!-- JavaScript -->
<script>
  document.body.setAttribute('data-theme', 'dark');
</script>
```

---

## 📊 COMPARACIÓN ANTES/DESPUÉS

### ANTES (15+ breakpoints, inconsistente)
```
Login:      16px, 20px radius
Inventario: 24px radius
Categorías: 22px, variable padding
Presupuesto: 26px radius, 36px padding
...
```

### DESPUÉS (5 breakpoints, consistente)
```
Todos usan:
- 12px, 16px, 20px, 24px radius
- 12px-36px padding escalable
- Consistent gaps
- Standard shadows
- Mobile-first responsive
```

---

## 🚀 PRÓXIMAS PASOS

Páginas pendientes de migración:
- [ ] Inicio/Home
- [ ] Facturas
- [ ] Calendario
- [ ] Ajustes
- [ ] Login/Recuperación
- [ ] Not Found

Cada migración sigue el mismo patrón: reemplazar valores hardcodeados con variables CSS.

---

## 💡 PREGUNTAS FRECUENTES

**¿Se pierden los diseños específicos de cada página?**
No. Cada página mantiene sus colores, fondos y temas específicos, pero ahora usan variables CSS consistentes.

**¿Funciona en navegadores antiguos?**
Sí. CSS variables funcionan en todos los navegadores modernos (IE 11 no lo soporta, pero se puede usar un fallback).

**¿Cómo agrego una nueva página?**
1. Usa las variables predefinidas
2. Sigue el patrón mobile-first
3. Mantén los breakpoints estandarizados

**¿Qué pasa si necesito un radius especial?**
Crea una variable nueva en `variables.css`:
```css
--mi-pagina-custom-radius: 14px;
```

---

Implementado con ❤️ para consistencia y mantenibilidad.

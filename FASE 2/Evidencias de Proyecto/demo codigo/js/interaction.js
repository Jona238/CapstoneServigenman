// ==== Helpers JSON en localStorage ====
function loadJSON(key, defVal) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defVal;
  } catch { return defVal; }
}
function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ====== CLAVES ======
const INVENTORY_KEY = 'inventarioData';       // <- clave única para inventario
const CATS_KEY      = 'categoriasInventario'; // <- clave para categorías


function nextIdFromStorage() {
  const arr = loadJSON(INVENTORY_KEY, snapshotInventarioDesdeTabla());
  return arr.reduce((m, it) => Math.max(m, it.id || 0), 0) + 1;
}

// ====== RENDER helpers entre array <-> DOM ======
function renderInventarioToDOM(arr) {
  const tbody = document.querySelector('#tablaRecursos tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  arr.forEach(item=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.recurso}</td>
      <td>${item.categoria}</td>
      <td>${item.estado}</td>
      <td>
        <div class="tabla-acciones">
          <button class="boton-editar" onclick="editarFila(this)">Editar</button>
          <button class="boton-eliminar" onclick="eliminarFila(this)">Eliminar</button>
        </div>
      </td>`;
    tbody.appendChild(tr);
  });
}

// ====== Bootstrap: cargar de storage si existe; sino sembrar desde DOM actual ======
function bootstrapInventario() {
  let data = loadJSON(INVENTORY_KEY, null);
  if (Array.isArray(data) && data.length) {
    // Ya existe inventario persistido -> renderízalo
    renderInventarioToDOM(data);
  } else {
    // Si no hay nada en storage, sembrar desde DOM inicial
    data = snapshotInventarioDesdeTabla();
    saveJSON(INVENTORY_KEY, data);
  }

  // Inicializa categorías base si hace falta
  let cats = loadJSON(CATS_KEY, null);
  if (!Array.isArray(cats) || !cats.length) {
    const set = new Set(data.map(x=>x.categoria).filter(Boolean));
    saveJSON(CATS_KEY, Array.from(set).sort((a,b)=>a.localeCompare(b,'es')));
  }
}



function snapshotInventarioDesdeTabla() {
  const rows = Array.from(document.querySelectorAll('#tablaRecursos tbody tr'));
  const items = rows.map(tr => {
    const tds = tr.querySelectorAll('td');
    return {
      id: parseInt(tds[0].innerText, 10),
      recurso: tds[1].innerText.trim(),
      categoria: tds[2].innerText.trim(),
      estado: tds[3].innerText.trim(),
    };
  });
  return items;
}
function persistInventario() {
  const items = snapshotInventarioDesdeTabla();
  saveJSON(INVENTORY_KEY, items);
}



function filtrarTabla({ resetPage = true } = {}) {
  const inputIdRango = document.getElementById("filtroIdRango").value.trim();
  let idExacto = null, idDesde = null, idHasta = null;

  if (inputIdRango.includes("-")) {
    const partes = inputIdRango.split("-");
    if (partes[0] !== "" && !isNaN(partes[0])) idDesde = parseInt(partes[0]);
    if (partes[1] !== "" && !isNaN(partes[1])) idHasta = parseInt(partes[1]);
  } else if (!isNaN(inputIdRango) && inputIdRango !== "") {
    idExacto = parseInt(inputIdRango);
  }

  const inputRecurso   = document.getElementById("filtroRecurso").value.toLowerCase();
  const inputCategoria = document.getElementById("filtroCategoria").value.toLowerCase();
  const inputEstado    = document.getElementById("filtroEstado").value.toLowerCase();

  const filas = document.querySelectorAll("#tablaRecursos tbody tr");

  filas.forEach(fila => {
    const celdaId        = parseInt(fila.cells[0].innerText);
    const celdaRecurso   = fila.cells[1].innerText.toLowerCase();
    const celdaCategoria = fila.cells[2].innerText.toLowerCase();
    const celdaEstado    = fila.cells[3].innerText.toLowerCase();

    const coincideId =
      (idExacto === null || celdaId === idExacto) &&
      (idDesde === null || celdaId >= idDesde) &&
      (idHasta === null || celdaId <= idHasta);

    const mostrar =
      coincideId &&
      celdaRecurso.includes(inputRecurso) &&
      celdaCategoria.includes(inputCategoria) &&
      celdaEstado.includes(inputEstado);

    fila.dataset.match = mostrar ? "1" : "0";
    fila.style.display = mostrar ? "" : "none";
  });

  if (resetPage) paginaActual = 1;
  actualizarPaginacion();

  persistInventario(); // guarda el inventario actual para categorias.html

}




function ordenarTabla() {
  const sel = document.getElementById("ordenarPor");
  if (!sel) return; // <- si no hay selector (p.ej. en categorias.html), no hacemos nada

  const criterio = sel.value;
  const tbody = document.querySelector("#tablaRecursos tbody");
  if (!tbody) return;

  const filas = Array.from(tbody.querySelectorAll("tr"));

  let columnaIndex;
  let ascendente = true;

  switch (criterio) {
    case "id-asc":         columnaIndex = 0; ascendente = true;  break;
    case "id-desc":        columnaIndex = 0; ascendente = false; break;
    case "recurso-asc":    columnaIndex = 1; ascendente = true;  break;
    case "recurso-desc":   columnaIndex = 1; ascendente = false; break;
    case "categoria-asc":  columnaIndex = 2; ascendente = true;  break;
    case "categoria-desc": columnaIndex = 2; ascendente = false; break;
    case "estado-asc":     columnaIndex = 3; ascendente = true;  break;
    case "estado-desc":    columnaIndex = 3; ascendente = false; break;
    default: return;
  }

  filas.sort((a, b) => {
    let valorA = a.cells[columnaIndex].innerText.trim().toLowerCase();
    let valorB = b.cells[columnaIndex].innerText.trim().toLowerCase();

    if (columnaIndex === 0) {
      valorA = parseInt(valorA, 10);
      valorB = parseInt(valorB, 10);
      return ascendente ? valorA - valorB : valorB - valorA;
    }
    if (valorA < valorB) return ascendente ? -1 : 1;
    if (valorA > valorB) return ascendente ? 1 : -1;
    return 0;
  });

  filas.forEach(fila => tbody.appendChild(fila));
  persistInventario();
}






function limpiarFiltros() {
    document.getElementById("filtroIdRango").value = "";
    document.getElementById("filtroRecurso").value = "";
    document.getElementById("filtroCategoria").value = "";
    document.getElementById("filtroEstado").value = "";
    document.getElementById("sugerenciasRecurso").innerHTML = "";
    filtrarTabla();

}




function actualizarSugerencias() {
  const recursoInput   = document.getElementById("filtroRecurso");
  const sugerenciasDiv = document.getElementById("sugerenciasRecurso");
  const texto = recursoInput.value.toLowerCase();
  sugerenciasDiv.innerHTML = "";

  if (texto.length < 2) { sugerenciasDiv.className = ""; return; }

  sugerenciasDiv.className = "autocomplete-box";

  // Tomar recursos desde storage (o DOM si no hay)
  const arr = loadJSON(INVENTORY_KEY, snapshotInventarioDesdeTabla());
  const recursosUnicos = Array.from(new Set(arr.map(it => it.recurso))).sort((a,b)=>a.localeCompare(b,'es'));

  const sugerencias = recursosUnicos.filter(r => r.toLowerCase().includes(texto)).slice(0, 12);

  sugerencias.forEach(opcion => {
    const div = document.createElement("div");
    div.className = "sugerencia-item";
    const regex = new RegExp(`(${texto})`, 'gi');
    div.innerHTML = opcion.replace(regex, "<strong>$1</strong>");
    div.onclick = () => {
      recursoInput.value = opcion;
      sugerenciasDiv.innerHTML = "";
      sugerenciasDiv.className = "";
      filtrarTabla({ resetPage: true });
    };
    sugerenciasDiv.appendChild(div);
  });
}




function editarFila(boton) {
  const fila = boton.closest("tr");
  const celdas = fila.querySelectorAll("td");

  const id = celdas[0].innerText;
  const recurso = celdas[1].innerText;
  const categoria = celdas[2].innerText;
  const estado = celdas[3].innerText;

  celdas[1].innerHTML = `<input type="text" value="${recurso}" class="editar-input">`;
  celdas[2].innerHTML = `<input type="text" value="${categoria}" class="editar-input">`;
  celdas[3].innerHTML = `<input type="text" value="${estado}" class="editar-input">`;

  celdas[4].innerHTML = `
    <div class="tabla-acciones">
      <button class="boton-guardar" onclick="guardarFila(this)">Guardar</button>
      <button class="boton-cancelar" onclick="cancelarEdicion(this, '${recurso}', '${categoria}', '${estado}')">Cancelar</button>
    </div>
  `;
}

function guardarFila(boton) {
  const fila = boton.closest("tr");
  const celdas = fila.querySelectorAll("td");

  const nuevoRecurso   = celdas[1].querySelector("input").value.trim();
  const nuevaCategoria = celdas[2].querySelector("input").value.trim();
  const nuevoEstado    = celdas[3].querySelector("input").value.trim();

  // Actualiza DOM inmediato (opcional)
  celdas[1].innerText = nuevoRecurso;
  celdas[2].innerText = nuevaCategoria;
  celdas[3].innerText = nuevoEstado;

  celdas[4].innerHTML = `
    <div class="tabla-acciones">
      <button class="boton-editar" onclick="editarFila(this)">Editar</button>
      <button class="boton-eliminar" onclick="eliminarFila(this)">Eliminar</button>
    </div>
  `;

  // Persistir desde DOM -> storage
  persistInventario();

  // Re-render desde storage (para asegurar sincronía total)
  const arr = loadJSON(INVENTORY_KEY, snapshotInventarioDesdeTabla());
  renderInventarioToDOM(arr);

  // Volver a aplicar filtros/orden/paginación (sin saltar de página)
  filtrarTabla({ resetPage: false });
  ordenarTabla();
  actualizarPaginacion();
}


function cancelarEdicion(boton, recurso, categoria, estado) {
  const fila = boton.closest("tr");
  const celdas = fila.querySelectorAll("td");

  celdas[1].innerText = recurso;
  celdas[2].innerText = categoria;
  celdas[3].innerText = estado;

  celdas[4].innerHTML = `
    <div class="tabla-acciones">
      <button class="boton-editar" onclick="editarFila(this)">Editar</button>
      <button class="boton-eliminar" onclick="eliminarFila(this)">Eliminar</button>
    </div>
  `;

  filtrarTabla();
  ordenarTabla();
  actualizarPaginacion();
}

function eliminarFila(boton) {
  if (!confirm("¿Estás seguro de que deseas eliminar este recurso?")) return;

  // Quita del DOM
  const fila = boton.closest("tr");
  fila.remove();

  // Persistir desde DOM -> storage
  persistInventario();

  // Re-render desde storage
  const arr = loadJSON(INVENTORY_KEY, snapshotInventarioDesdeTabla());
  renderInventarioToDOM(arr);

  // Reaplicar filtros/orden y ajustar página si corresponde
  filtrarTabla({ resetPage: false });
  ordenarTabla();
  actualizarPaginacion();
}



 // agregar recurso 

//let ultimoId = 0;






function agregarRecurso(event) {
  event.preventDefault();

  const recurso   = document.getElementById("nuevoRecurso").value.trim();
  const categoria = document.getElementById("nuevaCategoria").value.trim();
  const estado    = document.getElementById("nuevoEstado").value.trim();

  if (!recurso || !categoria || !estado) return;

  // === 1) Cargar inventario desde storage (o desde DOM si no hay) ===
  const arr = loadJSON(INVENTORY_KEY, snapshotInventarioDesdeTabla());

  // === 2) ID único desde storage ===
  const nuevo = { id: nextIdFromStorage(), recurso, categoria, estado };

  // === 3) Agregar al arreglo y persistir ===
  arr.push(nuevo);
  saveJSON(INVENTORY_KEY, arr);

  // === 4) Renderizar DOM desde el arreglo (en lugar de insertar una sola fila) ===
  renderInventarioToDOM(arr);

  // === 5) Datalist: categoría nueva (form + filtros) ===
  (function syncDatalistsCategoria(catNueva) {
    if (!catNueva) return;

    const dlForm  = document.getElementById('categoriasFormulario');
    const dlFilt  = document.getElementById('categorias');

    if (dlForm && !Array.from(dlForm.options).some(o => o.value.toLowerCase() === catNueva.toLowerCase())) {
      const opt = document.createElement('option'); opt.value = catNueva; dlForm.appendChild(opt);
    }
    if (dlFilt && !Array.from(dlFilt.options).some(o => o.value.toLowerCase() === catNueva.toLowerCase())) {
      const opt2 = document.createElement('option'); opt2.value = catNueva; dlFilt.appendChild(opt2);
    }

    // Persistir categorías para categorias.html
    let cats = loadJSON(CATS_KEY, []);
    if (!cats.some(c => c.toLowerCase() === catNueva.toLowerCase())) {
      cats.push(catNueva);
      saveJSON(CATS_KEY, cats);
    }
  })(categoria);

  // === 6) Reset del formulario ===
  document.getElementById("formAgregar").reset();

  // === 7) Recordar página actual, re-filtrar/ordenar, repaginar sin mandarte a la página 1 ===
  const paginaPrev = paginaActual;
  filtrarTabla({ resetPage: false });
  ordenarTabla();
  persistInventario(); // guarda INVENTORY_KEY desde DOM

  // Volver a la página anterior si existe
  const totalFiltradas = document.querySelectorAll('#tablaRecursos tbody tr[data-match="1"]').length;
  const totalPaginas   = Math.max(1, Math.ceil(totalFiltradas / filasPorPagina));
  paginaActual = Math.min(paginaPrev, totalPaginas);
  actualizarPaginacion();
}



// ==== MENU EXPORTAR ==== //

function toggleExportMenu() {
  const menu = document.getElementById('exportMenu');
  menu.classList.toggle('show');
  // cerrar submenús si el principal se cierra
  if (!menu.classList.contains('show')) {
    document.querySelectorAll('.submenu-content').forEach(s => s.classList.remove('show'));
  }
}

function toggleSubmenu(id) {
  // cerrar otros submenús
  document.querySelectorAll('.submenu-content').forEach(s => {
    if (s.id !== id) s.classList.remove('show');
  });
  const sub = document.getElementById(id);
  sub.classList.toggle('show');
}

function closeAllMenus() {
  document.getElementById('exportMenu')?.classList.remove('show');
  document.querySelectorAll('.submenu-content').forEach(s => s.classList.remove('show'));
}

// Cerrar si haces click fuera
document.addEventListener('click', (e) => {
  if (!e.target.closest('.exportar-dropdown')) closeAllMenus();
});


// ==== EXPORTAR CSV Y EXCEL ==== //

function exportarCSV(opcion = "todo") {
  const filas = (opcion === "visible") ? filasPaginaActual() : filasFiltradas();
  const encabezados = encabezadosTabla();
  const datos = datosDesdeFilas(filas);

  // Construir CSV
  const lineas = [];
  lineas.push(encabezados.join(","));
  datos.forEach(arr => {
    // Escapar comillas y separar por coma
    const linea = arr.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",");
    lineas.push(linea);
  });

  const blob = new Blob([lineas.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = (opcion === "visible") ? "inventario_visible.csv" : "inventario_todo.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


function exportarExcel(opcion = "todo") {
  const filas = (opcion === "visible") ? filasPaginaActual() : filasFiltradas();
  const encabezados = encabezadosTabla();
  const datos = [encabezados, ...datosDesdeFilas(filas)]; // AOA con encabezados

  const ws = XLSX.utils.aoa_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Inventario");
  XLSX.writeFile(wb, (opcion === "visible") ? "inventario_visible.xlsx" : "inventario_todo.xlsx");
}






// ===== CONFIGURACIÓN PAGINACION =====

let filasPorPagina = 10; // Cambia a 15 si quieres
let paginaActual = 1;
let todasLasFilas = []; // Guardará todas las filas visibles (con filtros aplicados)

// ===== CARGAR PAGINACIÓN =====
function actualizarPaginacion() {
  const tbody = document.querySelector("#tablaRecursos tbody");
  const filas = Array.from(tbody.querySelectorAll("tr"));

  // Filas que pasan el filtro (independiente de display previo)
  const filtradas = filas.filter(f => f.dataset.match === "1");

  const total = filtradas.length;
  const totalPaginas = Math.max(1, Math.ceil(total / filasPorPagina));

  // Corrige página fuera de rango
  if (paginaActual > totalPaginas) paginaActual = totalPaginas;
  if (paginaActual < 1) paginaActual = 1;

  // Primero oculta TODAS las filas que pasan filtro
  filtradas.forEach(f => f.style.display = "none");

  // Muestra solo el slice de la página actual
  const inicio = (paginaActual - 1) * filasPorPagina;
  const fin = inicio + filasPorPagina;
  filtradas.slice(inicio, fin).forEach(f => f.style.display = "");

  // Las que no pasan filtro ya estaban en display:none por filtrarTabla()

  // UI de paginación
  document.getElementById("infoPagina").textContent =
    `Página ${paginaActual} de ${totalPaginas}`;
  document.getElementById("btnAnterior").disabled = paginaActual <= 1;
  document.getElementById("btnSiguiente").disabled = paginaActual >= totalPaginas;

  persistInventario(); // guarda el inventario actual para categorias.html

}



function cambiarPagina(direccion) {
  paginaActual += direccion;
  actualizarPaginacion();
}









// ===== Exportar “Visible” vs “Todo” (respetando filtros) ======== //

// Devuelve TODAS las filas que pasan filtro (data-match="1")
function filasFiltradas() {
  const tbody = document.querySelector("#tablaRecursos tbody");
  return Array.from(tbody.querySelectorAll("tr")).filter(tr => tr.dataset.match === "1");
}

// Devuelve SOLO las filas visibles de la página actual
function filasPaginaActual() {
  const todas = filasFiltradas();
  const inicio = (paginaActual - 1) * filasPorPagina;
  const fin = inicio + filasPorPagina;
  return todas.slice(inicio, fin);
}

// Convierte filas -> arreglo de arreglos (solo columnas 0..3 = sin "Acciones")
function datosDesdeFilas(filas) {
  return filas.map(tr => {
    const tds = tr.querySelectorAll("td");
    return [
      tds[0].innerText, // ID
      tds[1].innerText, // Recurso
      tds[2].innerText, // Categoría
      tds[3].innerText  // Estado
    ];
  });
}

// Encabezados (opcional pero recomendado para CSV/Excel)
function encabezadosTabla() {
  const ths = document.querySelectorAll("#tablaRecursos thead th");
  // Tomar solo los 4 primeros (sin Acciones)
  return Array.from(ths).slice(0, 4).map(th => th.innerText);
}




// === Tema claro/oscuro con persistencia ==================================
(function () {
  const body   = document.body;
  const toggle = document.getElementById('themeSwitch');
  const label  = document.getElementById('themeLabel');

  // Cargar preferencia guardada
  const saved = localStorage.getItem('theme'); // 'dark' | 'light' | null
  if (saved === 'dark') {
    body.setAttribute('data-theme', 'dark');
    if (toggle) toggle.checked = true;
    if (label)  label.textContent = 'Oscuro';
  } else {
    // por defecto, claro
    body.removeAttribute('data-theme');
    if (toggle) toggle.checked = false;
    if (label)  label.textContent = 'Claro';
  }

  // Cambios en tiempo real
  if (toggle) {
    toggle.addEventListener('change', () => {
      if (toggle.checked) {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (label) label.textContent = 'Oscuro';
      } else {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (label) label.textContent = 'Claro';
      }
    });
  }
})();








function initCategoriasDesdeTablaYListas() {
  const set = new Set();

  // 1) desde la tabla (columna Categoría = índice 2)
  document.querySelectorAll('#tablaRecursos tbody tr').forEach(tr => {
    const cat = (tr.cells[2]?.innerText || '').trim();
    if (cat) set.add(cat);
  });

  // 2) desde datalist de filtros
  document.querySelectorAll('#categorias option').forEach(opt => {
    const v = (opt.value || '').trim();
    if (v) set.add(v);
  });

  // 3) desde datalist del formulario
  document.querySelectorAll('#categoriasFormulario option').forEach(opt => {
    const v = (opt.value || '').trim();
    if (v) set.add(v);
  });

  // Persistir
  localStorage.setItem('categoriasInventario', JSON.stringify(Array.from(set)));
}

// Si hay un preset de categoría (puesto en categorias.html), aplicarlo a filtrosfunction aplicarPresetCategoria() {
function aplicarPresetCategoria() {
  const preset = localStorage.getItem('presetCategoria');
  if (preset) {
    const inputCat = document.getElementById('filtroCategoria');
    if (inputCat) {
      inputCat.value = preset;
      if (typeof filtrarTabla === 'function') filtrarTabla({ resetPage: true });
    }
    localStorage.removeItem('presetCategoria');
  }
}










// ===== INICIALIZAR =====
document.addEventListener("DOMContentLoaded", () => {
  // Si estamos en index.html (existe la tabla)
  if (document.getElementById('tablaRecursos')) {
    bootstrapInventario();
    ordenarTabla();
    filtrarTabla({ resetPage: true });
    paginaActual = 1;
    actualizarPaginacion();
    initCategoriasDesdeTablaYListas();
    aplicarPresetCategoria();
  }
  // Si estamos en categorias.html, el carrusel se inicializa en el IIFE de categorías (más abajo).
});





// ================================
//  CATEGORÍAS (multi-carrusel, colores, infinito)
// ================================
(function () {
  const ITEMS_KEY  = 'inventarioData';
  const LEGACY_KEY = 'inventarioItems';
  const COLORS_KEY = 'categoriaColors';

  // Paleta más viva
  const PALETA = [
    { bg:'#FF7A7A', hover:'#FF5C5C', text:'#0B1324' },
    { bg:'#9B8CFF', hover:'#7D6BFF', text:'#0B1324' },
    { bg:'#B9FBC0', hover:'#86F3A1', text:'#0B1324' },
    { bg:'#CDEAFE', hover:'#A9DAFE', text:'#0B1324' },
    { bg:'#FFD166', hover:'#FFC145', text:'#0B1324' },
    { bg:'#F8B4D9', hover:'#F38BC8', text:'#0B1324' },
    { bg:'#A7F3D0', hover:'#6EE7B7', text:'#0B1324' },
    { bg:'#FDE68A', hover:'#FCD34D', text:'#0B1324' },
  ];

  const $all = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const hash = s => { let h=0; for (let i=0;i<s.length;i++) h=((h<<5)-h)+s.charCodeAt(i)|0; return Math.abs(h); };

  // Lee y agrupa categorías -> [{name,count}]
  function getCategories() {
    const items = loadJSON(ITEMS_KEY, loadJSON(LEGACY_KEY, []));
    const map = new Map();
    items.forEach(it => {
      const c = (it.categoria || 'Sin categoría').trim();
      if (!c) return;
      map.set(c, (map.get(c) || 0) + 1);
    });
    return [...map.entries()]
      .sort((a,b)=> a[0].localeCompare(b[0],'es'))
      .map(([name,count])=>({name,count}));
  }

  // Colores persistidos (mismos para ambas filas)
  function getColorMap(cats) {
    let colorMap = loadJSON(COLORS_KEY, {});
    const usados = new Set(Object.values(colorMap).map(c => `${c.bg},${c.hover},${c.text}`));

    cats.forEach(({name})=>{
      if (!colorMap[name]) {
        let pick = PALETA.find(p => !usados.has(`${p.bg},${p.hover},${p.text}`));
        if (!pick) pick = PALETA[ hash(name) % PALETA.length ];
        colorMap[name] = pick;
        usados.add(`${pick.bg},${pick.hover},${pick.text}`);
      }
    });
    saveJSON(COLORS_KEY, colorMap);
    return colorMap;
  }

  // Construye tarjetas en un track; puedes rotar el inicio para la fila de abajo
  function buildCards(track, cats, colorMap, rotateBy=0) {
    track.innerHTML = '';
    if (!cats.length) {
      track.innerHTML = '<p style="padding:8px 0">No hay elementos aún. Agrega recursos en el inventario.</p>';
      return;
    }

    const rotated = cats.slice(); // copia
    if (rotateBy) {
      const k = ((rotateBy % cats.length) + cats.length) % cats.length;
      rotated.push(...rotated.splice(0, k));
    }

    rotated.forEach(({name,count})=>{
      const col = colorMap[name];
      const card = document.createElement('div');
      card.className = 'category-card';
      card.style.setProperty('--card-bg', col.bg);
      card.style.setProperty('--card-hover', col.hover);
      card.style.setProperty('--card-text', col.text);
      card.style.backgroundColor = col.bg;
      card.style.color = col.text;
      card.innerHTML = `
        <div class="category-card__body">
          <div class="category-card__icon">📦</div>
          <h4 class="category-card__title">${name}</h4>
          <p class="category-card__hint">${count} recurso(s)</p>
        </div>`;
      card.addEventListener('click', ()=>{
        localStorage.setItem('presetCategoria', name);
        location.href = 'index.html';
      });
      track.appendChild(card);
    });
  }

  function makeInfinite(track) {
  const CARD_SEL = '.category-card';
  const getStep = () => {
    const c = track.querySelector(CARD_SEL);
    if (!c) return 0;
    const gap = parseInt(getComputedStyle(track).gap || '20', 10);
    return c.offsetWidth + gap;
  };

  let animating = false;
  const DURATION = 280; // ms, ponlo a tu gusto (250–350)

  function lock() {
    animating = true;
    setTimeout(() => { animating = false; }, DURATION);
  }

  function stepOne(dir) {
    if (animating) return;
    const step = getStep();
    if (!step) return;

    // Adelantamos/retrocedemos el DOM y compensamos scroll ANTES de animar
    if (dir > 0) {
      // → siguiente
      const first = track.querySelector(CARD_SEL);
      if (first) {
        track.appendChild(first);     // 1) la primera pasa al final
        track.scrollLeft += step;     // 2) compensación instantánea (no se ve cambio)
      }
      lock();
      track.scrollBy({ left: step, behavior: 'smooth' }); // 3) animación hacia la derecha
    } else {
      // ← anterior
      const cards = track.querySelectorAll(CARD_SEL);
      const last = cards[cards.length - 1];
      if (last) {
        track.insertBefore(last, track.firstChild); // 1) la última pasa al inicio
        track.scrollLeft -= step;                   // 2) compensación instantánea
      }
      lock();
      track.scrollBy({ left: -step, behavior: 'smooth' }); // 3) animación hacia la izquierda
    }
  }

  return { stepOne };
}





  function bindArrows(container, stepper) {
    const prev = container.querySelector('.cat-nav.prev');
    const next = container.querySelector('.cat-nav.next');
    // no deshabilitamos nunca, porque es infinito
    prev.addEventListener('click', e => { e.stopPropagation(); stepper.stepOne(-1); }, { capture:true });
    next.addEventListener('click', e => { e.stopPropagation(); stepper.stepOne(+1); }, { capture:true });
  }

  function initAllCarousels() {
    // Tamaño por defecto (5 por vista)
    if (!document.body.hasAttribute('data-cards')) {
      document.body.setAttribute('data-cards', 'expanded');
    }

    const cats = getCategories();
    const colors = getColorMap(cats);

    const carousels = $all('.category-carousel');
    carousels.forEach((car, idx) => {
      const track = car.querySelector('.category-track');
      if (!track) return;

      // Fila de abajo empieza desplazada (mitad de la lista)
      const rotateBy = (car.dataset.row === 'bottom') ? Math.floor(cats.length/2) : 0;

      buildCards(track, cats, colors, rotateBy);
      const stepper = makeInfinite(track);
      bindArrows(car, stepper);
    });

    // Switch tamaño (si existe)
    const sw  = document.getElementById('cardsSwitch');
    const lbl = document.getElementById('cardsLabel');
    const saved = localStorage.getItem('cardsMode');
    if (saved) {
      document.body.setAttribute('data-cards', saved);
      if (sw)  sw.checked = (saved === 'compact');
      if (lbl) lbl.textContent = (saved === 'compact') ? 'Compacto' : 'Extendido';
    }
    sw?.addEventListener('change', () => {
      const mode = sw.checked ? 'compact' : 'expanded';
      document.body.setAttribute('data-cards', mode);
      localStorage.setItem('cardsMode', mode);
      if (lbl) lbl.textContent = sw.checked ? 'Compacto' : 'Extendido';
    });
  }

  document.addEventListener('DOMContentLoaded', initAllCarousels);
})();




//BOTON LETRA MÁS GRANDE / MÁS PEQUEÑA //

// Añade al final de interaction.js
(function(){
  const root = document.documentElement;
  const get = () => parseFloat(getComputedStyle(root).getPropertyValue('--ui-scale')) || 1;
  const set = v => root.style.setProperty('--ui-scale', Math.max(.9, Math.min(1.25, v)));
  document.getElementById('aMas')  ?.addEventListener('click', ()=> set(get()+0.05));
  document.getElementById('aMenos')?.addEventListener('click', ()=> set(get()-0.05));
})();

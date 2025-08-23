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
}




function ordenarTabla() {
  const criterio = document.getElementById("ordenarPor").value;
  const tbody = document.querySelector("#tablaRecursos tbody");
  const filas = Array.from(tbody.querySelectorAll("tr"));

  let columnaIndex;
  let ascendente = true;

  switch (criterio) {
    case "id-asc":
      columnaIndex = 0; ascendente = true; break;
    case "id-desc":
      columnaIndex = 0; ascendente = false; break;
    case "recurso-asc":
      columnaIndex = 1; ascendente = true; break;
    case "recurso-desc":
      columnaIndex = 1; ascendente = false; break;
    case "categoria-asc":
      columnaIndex = 2; ascendente = true; break;
    case "categoria-desc":
      columnaIndex = 2; ascendente = false; break;
    case "estado-asc":
      columnaIndex = 3; ascendente = true; break;
    case "estado-desc":
      columnaIndex = 3; ascendente = false; break;
    default:
      return; // No ordenar
  }

  filas.sort((a, b) => {
    let valorA = a.cells[columnaIndex].innerText.trim().toLowerCase();
    let valorB = b.cells[columnaIndex].innerText.trim().toLowerCase();

    // Si la columna es ID, convertir a número
    if (columnaIndex === 0) {
      valorA = parseInt(valorA);
      valorB = parseInt(valorB);
      return ascendente ? valorA - valorB : valorB - valorA;
    }

    // Para texto
    if (valorA < valorB) return ascendente ? -1 : 1;
    if (valorA > valorB) return ascendente ? 1 : -1;
    return 0;
  });

  // Volver a agregar filas ordenadas
  filas.forEach(fila => tbody.appendChild(fila));
}

// Ejecutar el orden predeterminado al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  ordenarTabla();
});



function limpiarFiltros() {
    document.getElementById("filtroIdRango").value = "";
    document.getElementById("filtroRecurso").value = "";
    document.getElementById("filtroCategoria").value = "";
    document.getElementById("filtroEstado").value = "";
    document.getElementById("sugerenciasRecurso").innerHTML = "";
    filtrarTabla();

}


function actualizarSugerencias() {
  const recursoInput = document.getElementById("filtroRecurso");
  const sugerenciasDiv = document.getElementById("sugerenciasRecurso");
  const texto = recursoInput.value.toLowerCase();
  sugerenciasDiv.innerHTML = "";

  if (texto.length < 2) {
    sugerenciasDiv.className = "";
    return;
  }

  sugerenciasDiv.className = "autocomplete-box";

  const recursos = [
    "Bombas sumergibles 1HP",
    "Kit reparación rodamientos",
    "Llave Stilson 18”",
    "Grasa multipropósito 1kg",
    "Cable eléctrico 3x2.5mm 100m"
  ];

  const sugerencias = recursos.filter(r => r.toLowerCase().includes(texto));

  sugerencias.forEach(opcion => {
    const div = document.createElement("div");
    div.className = "sugerencia-item";

    // Resaltar coincidencia
    const regex = new RegExp(`(${texto})`, 'gi');
    div.innerHTML = opcion.replace(regex, "<strong>$1</strong>");

    div.onclick = () => {
      recursoInput.value = opcion;
      sugerenciasDiv.innerHTML = "";
      sugerenciasDiv.className = "";
      filtrarTabla();
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

  celdas[1].innerText = nuevoRecurso;
  celdas[2].innerText = nuevaCategoria;
  celdas[3].innerText = nuevoEstado;

  celdas[4].innerHTML = `
    <div class="tabla-acciones">
      <button class="boton-editar" onclick="editarFila(this)">Editar</button>
      <button class="boton-eliminar" onclick="eliminarFila(this)">Eliminar</button>
    </div>
  `;

  // Revalidar con filtros, mantener orden y repaginar
  filtrarTabla();
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
  const fila = boton.closest("tr");
  fila.remove();

  // Recalcular total filtrado y páginas
  filtrarTabla();
  ordenarTabla();
  // Ajustar página si quedó fuera de rango lo hace actualizarPaginacion()
  actualizarPaginacion();
}


 // agregar recurso 

let ultimoId = 0;


document.addEventListener("DOMContentLoaded", () => {
  const ids = Array.from(document.querySelectorAll("#tablaRecursos tbody tr td:first-child"))
                   .map(td => parseInt(td.innerText));
  ultimoId = ids.length ? Math.max(...ids) : 0;
});



function agregarRecurso(event) {
  event.preventDefault();

  const recurso = document.getElementById("nuevoRecurso").value.trim();
  const categoria = document.getElementById("nuevaCategoria").value.trim();
  const estado = document.getElementById("nuevoEstado").value.trim();

  const datalistCategorias = document.getElementById("categoriasFormulario");
  const datalistEstados = document.getElementById("estadosFormulario");

  if (!recurso || !categoria || !estado) return;

   // Agregar nueva categoría si no existe
  const opcionesCat = Array.from(datalistCategorias.options).map(o => o.value.toLowerCase());
  if (!opcionesCat.includes(categoria.toLowerCase())) {
  // Añadir al datalist del formulario
  const nuevaOpcionForm = document.createElement("option");
  nuevaOpcionForm.value = categoria;
  datalistCategorias.appendChild(nuevaOpcionForm);

  // Añadir al datalist del filtro
  const datalistFiltroCat = document.getElementById("categorias");
  const nuevaOpcionFiltro = document.createElement("option");
  nuevaOpcionFiltro.value = categoria;
  datalistFiltroCat.appendChild(nuevaOpcionFiltro);
}


  // 📌 Si el estado no existe, agregarlo
  const opcionesEst = Array.from(datalistEstados.options).map(o => o.value.toLowerCase());
  if (!opcionesEst.includes(estado.toLowerCase())) {
    const nuevaOpcion = document.createElement("option");
    nuevaOpcion.value = estado;
    datalistEstados.appendChild(nuevaOpcion);
  }

  // 📌 Incrementar ID único
  ultimoId++;

  // 📌 Agregar nueva fila a la tabla
  const tabla = document.getElementById("tablaRecursos").querySelector("tbody");
  const nuevaFila = tabla.insertRow();

  nuevaFila.innerHTML = `
    <td>${ultimoId}</td>
    <td>${recurso}</td>
    <td>${categoria}</td>
    <td>${estado}</td>
    <td>
      <div class="tabla-acciones">
        <button class="boton-editar" onclick="editarFila(this)">Editar</button>
        <button class="boton-eliminar" onclick="eliminarFila(this)">Eliminar</button>
      </div>
    </td>
  `;

  document.getElementById("formAgregar").reset();
  // Vuelve a evaluar el nuevo registro con los filtros activos

// Guarda la página en la que estás
const paginaPrev = paginaActual;

// Reaplica filtro SIN resetear, reordena y repagina
filtrarTabla({ resetPage: false });
ordenarTabla();

// Recalcula total de páginas y vuelve a la página anterior si sigue existiendo
const totalFiltradas = document.querySelectorAll('#tablaRecursos tbody tr[data-match="1"]').length;
const totalPaginas = Math.max(1, Math.ceil(totalFiltradas / filasPorPagina));
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
}



function cambiarPagina(direccion) {
  paginaActual += direccion;
  actualizarPaginacion();
}




// ===== INICIALIZAR =====
document.addEventListener("DOMContentLoaded", () => {
  // con filtros vacíos, todas las filas deben quedar data-match="1"
  filtrarTabla();
  ordenarTabla();
  paginaActual = 1;
  actualizarPaginacion();
});



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

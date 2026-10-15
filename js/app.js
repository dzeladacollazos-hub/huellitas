// ================================
// HUELLITAS - Lógica de la tienda
// ================================

// Número de WhatsApp de la tienda (cambiar por el número real)
const WHATSAPP = "51999999999";

// Catálogo de productos (en el MVP se carga desde este arreglo)
const productos = [
  { id: 1, nombre: "Pechera acolchada ajustable", mascota: "perro", categoria: "pechera", precio: 49.90, img: "https://images.pexels.com/photos/15874595/pexels-photo-15874595.jpeg" },
  { id: 2, nombre: "Pechera antitirones para paseo", mascota: "perro", categoria: "pechera", precio: 59.90, img: "https://images.pexels.com/photos/17166739/pexels-photo-17166739.jpeg" },
  { id: 3, nombre: "Collar de cuero con hebilla", mascota: "perro", categoria: "collar", precio: 35.00, img: "https://images.pexels.com/photos/7349934/pexels-photo-7349934.jpeg" },
  { id: 4, nombre: "Collar de nylon colores", mascota: "perro", categoria: "collar", precio: 25.00, img: "https://images.pexels.com/photos/11557759/pexels-photo-11557759.jpeg" },
  { id: 5, nombre: "Correa retráctil 5 m", mascota: "perro", categoria: "correa", precio: 45.00, img: "https://images.pexels.com/photos/13821852/pexels-photo-13821852.jpeg" },
  { id: 6, nombre: "Placa de identificación grabada", mascota: "perro", categoria: "placa", precio: 25.00, img: "https://images.pexels.com/photos/29136881/pexels-photo-29136881.jpeg" },
  { id: 7, nombre: "Pelota resistente para morder", mascota: "perro", categoria: "juguete", precio: 19.90, img: "https://images.pexels.com/photos/31744794/pexels-photo-31744794.jpeg" },
  { id: 8, nombre: "Peluche con sonido", mascota: "perro", categoria: "juguete", precio: 22.90, img: "https://images.pexels.com/photos/33818735/pexels-photo-33818735.jpeg" },
  { id: 9, nombre: "Collar con cascabel para gato", mascota: "gato", categoria: "collar", precio: 22.00, img: "https://images.pexels.com/photos/14721013/pexels-photo-14721013.jpeg" },
  { id: 10, nombre: "Pechera + correa para gato", mascota: "gato", categoria: "correa", precio: 39.90, img: "https://images.pexels.com/photos/34700552/pexels-photo-34700552.jpeg" },
  { id: 11, nombre: "Placa mini para gato", mascota: "gato", categoria: "placa", precio: 22.00, img: "https://images.pexels.com/photos/4074726/pexels-photo-4074726.jpeg" },
  { id: 12, nombre: "Varita con plumas", mascota: "gato", categoria: "juguete", precio: 15.90, img: "https://images.pexels.com/photos/19237486/pexels-photo-19237486.jpeg" },
  { id: 13, nombre: "Pelotas de colores x3", mascota: "gato", categoria: "juguete", precio: 14.90, img: "https://images.pexels.com/photos/15000993/pexels-photo-15000993.jpeg" }
];

// Costos de envío por operador (S/)
const tarifas = {
  olva: { lima: 10, provincia: 18, dias: "1 a 2 días hábiles en Lima / 3 a 5 en provincia" },
  shalom: { lima: 8, provincia: 12, dias: "2 a 4 días hábiles (recojo en agencia)" }
};

// Estado de la tienda
let carrito = JSON.parse(localStorage.getItem("carritoHuellitas")) || [];
let filtroMascota = "todos";
let filtroCategoria = "todas";
let textoBusqueda = "";

// ---------- Utilidades ----------
const soles = (monto) => "S/ " + monto.toFixed(2);

function imagenChica(url) {
  return url + "?auto=compress&cs=tinysrgb&w=400";
}

function mostrarAviso(texto) {
  const aviso = document.getElementById("aviso");
  aviso.textContent = texto;
  aviso.style.display = "block";
  setTimeout(() => (aviso.style.display = "none"), 2000);
}

// ---------- Catálogo ----------
function mostrarProductos() {
  const contenedor = document.getElementById("listaProductos");
  const filtrados = productos.filter((p) => {
    const okMascota = filtroMascota === "todos" || p.mascota === filtroMascota;
    const okCategoria = filtroCategoria === "todas" || p.categoria === filtroCategoria;
    const okTexto = p.nombre.toLowerCase().includes(textoBusqueda);
    return okMascota && okCategoria && okTexto;
  });

  contenedor.innerHTML = filtrados
    .map(
      (p) => `
      <article class="producto">
        <img src="${imagenChica(p.img)}" alt="${p.nombre}" loading="lazy">
        <div class="producto-info">
          <span class="etiqueta">${p.mascota} · ${p.categoria}</span>
          <h3>${p.nombre}</h3>
          <p class="precio">${soles(p.precio)}</p>
          <button class="btn" onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
        </div>
      </article>`
    )
    .join("");

  document.getElementById("sinResultados").style.display = filtrados.length ? "none" : "block";
}

function activarBotonMascota(valor) {
  document.querySelectorAll(".filtro").forEach((b) => {
    b.classList.toggle("activo", b.dataset.mascota === valor);
  });
}

// Botones Todos / Perros / Gatos
document.querySelectorAll(".filtro").forEach((boton) => {
  boton.addEventListener("click", () => {
    filtroMascota = boton.dataset.mascota;
    activarBotonMascota(filtroMascota);
    mostrarProductos();
  });
});

// Select de categoría
document.getElementById("filtroCategoria").addEventListener("change", (e) => {
  filtroCategoria = e.target.value;
  mostrarProductos();
});

// Buscador del header
document.getElementById("buscador").addEventListener("input", (e) => {
  textoBusqueda = e.target.value.toLowerCase().trim();
  mostrarProductos();
  document.getElementById("catalogo").scrollIntoView();
});

// Links del menú (Perros / Gatos / Catálogo)
document.querySelectorAll("[data-filtro]").forEach((link) => {
  link.addEventListener("click", () => {
    filtroMascota = link.dataset.filtro;
    activarBotonMascota(filtroMascota);
    mostrarProductos();
  });
});

// Tarjetas de categorías
document.querySelectorAll(".categoria").forEach((cat) => {
  cat.addEventListener("click", () => {
    filtroCategoria = cat.dataset.categoria;
    document.getElementById("filtroCategoria").value = filtroCategoria;
    mostrarProductos();
  });
});

// ---------- Carrito ----------
function guardarCarrito() {
  localStorage.setItem("carritoHuellitas", JSON.stringify(carrito));
}

function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  const existe = carrito.find((item) => item.id === id);
  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, img: imagenChica(producto.img), cantidad: 1 });
  }
  guardarCarrito();
  actualizarCarrito();
  mostrarAviso("Producto agregado al carrito 🐾");
}

// Los ids de productos personalizados son texto, por eso comparamos como string
function cambiarCantidad(id, cambio) {
  const item = carrito.find((i) => String(i.id) === String(id));
  item.cantidad += cambio;
  if (item.cantidad <= 0) {
    carrito = carrito.filter((i) => String(i.id) !== String(id));
  }
  guardarCarrito();
  actualizarCarrito();
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter((i) => String(i.id) !== String(id));
  guardarCarrito();
  actualizarCarrito();
}

function calcularSubtotal() {
  return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function actualizarCarrito() {
  const lista = document.getElementById("carritoLista");
  lista.innerHTML = carrito
    .map(
      (item) => `
      <li class="item-carrito">
        <img src="${item.img}" alt="${item.nombre}">
        <div>
          <p>${item.nombre}</p>
          ${item.detalle ? `<small>${item.detalle}</small>` : ""}
          <p class="cantidad">
            <button onclick="cambiarCantidad('${item.id}', -1)">-</button>
            ${item.cantidad}
            <button onclick="cambiarCantidad('${item.id}', 1)">+</button>
            · ${soles(item.precio * item.cantidad)}
          </p>
        </div>
        <button class="btn-eliminar" onclick="eliminarDelCarrito('${item.id}')" title="Eliminar">🗑️</button>
      </li>`
    )
    .join("");

  const cantidadTotal = carrito.reduce((t, i) => t + i.cantidad, 0);
  document.getElementById("contadorCarrito").textContent = cantidadTotal;
  document.getElementById("carritoSubtotal").textContent = soles(calcularSubtotal());
  document.getElementById("carritoVacio").style.display = carrito.length ? "none" : "block";
  actualizarResumen();
}

// Abrir y cerrar el carrito
const panelCarrito = document.getElementById("carrito");
document.getElementById("abrirCarrito").addEventListener("click", () => panelCarrito.classList.add("abierto"));
document.getElementById("cerrarCarrito").addEventListener("click", () => panelCarrito.classList.remove("abierto"));
document.getElementById("irCheckout").addEventListener("click", () => panelCarrito.classList.remove("abierto"));

// ---------- Personalización ----------
const nombreMascota = document.getElementById("nombreMascota");
const telefonoPlaca = document.getElementById("telefonoPlaca");

function actualizarVistaPrevia() {
  document.getElementById("textoPrevio").textContent = nombreMascota.value.toUpperCase() || "MAX";
  document.getElementById("telefonoPrevio").textContent = "Cel: " + (telefonoPlaca.value || "---------");
  const color = document.querySelector('input[name="color"]:checked').value;
  document.getElementById("placaPrevia").style.backgroundColor = color;
}

nombreMascota.addEventListener("input", actualizarVistaPrevia);
telefonoPlaca.addEventListener("input", actualizarVistaPrevia);
document.querySelectorAll('input[name="color"]').forEach((r) => r.addEventListener("change", actualizarVistaPrevia));

document.getElementById("formPersonaliza").addEventListener("submit", (e) => {
  e.preventDefault();
  const error = document.getElementById("errorPersonaliza");
  const nombre = nombreMascota.value.trim();
  const telefono = telefonoPlaca.value.trim();

  if (nombre.length < 2) {
    error.textContent = "Escribe el nombre de tu mascota (mínimo 2 letras).";
    return;
  }
  if (!/^9\d{8}$/.test(telefono)) {
    error.textContent = "El celular debe tener 9 dígitos y empezar con 9.";
    return;
  }
  error.textContent = "";

  const tipo = document.getElementById("tipoPersonaliza").value;
  const colorTexto = document.querySelector('input[name="color"]:checked').parentElement.textContent.trim();
  const esPlaca = tipo === "placa";

  carrito.push({
    id: "p" + Date.now(),
    nombre: esPlaca ? "Placa personalizada" : "Collar bordado personalizado",
    detalle: `"${nombre}" · ${colorTexto} · Cel ${telefono}`,
    precio: esPlaca ? 25.0 : 39.9,
    img: imagenChica(esPlaca ? productos[5].img : productos[2].img),
    cantidad: 1
  });
  guardarCarrito();
  actualizarCarrito();
  mostrarAviso("¡Tu diseño se agregó al carrito! 🐾");
  e.target.reset();
  actualizarVistaPrevia();
});

// ---------- Checkout: envío y geolocalización ----------
function calcularEnvio() {
  const departamento = document.getElementById("departamento").value;
  const operador = document.querySelector('input[name="envio"]:checked').value;
  if (!departamento) return 0;
  const esLima = departamento === "Lima" || departamento === "Callao";
  return esLima ? tarifas[operador].lima : tarifas[operador].provincia;
}

function actualizarResumen() {
  const subtotal = calcularSubtotal();
  const envio = carrito.length ? calcularEnvio() : 0;
  document.getElementById("resSubtotal").textContent = soles(subtotal);
  document.getElementById("resEnvio").textContent = soles(envio);
  document.getElementById("resTotal").textContent = soles(subtotal + envio);

  const departamento = document.getElementById("departamento").value;
  const operador = document.querySelector('input[name="envio"]:checked').value;
  document.getElementById("infoEnvio").textContent = departamento
    ? `Envío a ${departamento}: ${soles(calcularEnvio())} · Tiempo estimado: ${tarifas[operador].dias}`
    : "Selecciona tu departamento para calcular el envío.";
}

document.getElementById("departamento").addEventListener("change", actualizarResumen);
document.querySelectorAll('input[name="envio"]').forEach((r) => r.addEventListener("change", actualizarResumen));

// Detecta si el cliente está en Lima/Callao usando su ubicación
document.getElementById("btnUbicacion").addEventListener("click", () => {
  const mensaje = document.getElementById("mensajeUbicacion");
  if (!navigator.geolocation) {
    mensaje.textContent = "Tu navegador no permite detectar la ubicación.";
    return;
  }
  mensaje.textContent = "Detectando tu ubicación...";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      // Rango aproximado de Lima Metropolitana y Callao
      const enLima = lat > -12.55 && lat < -11.7 && lon > -77.25 && lon < -76.7;
      if (enLima) {
        document.getElementById("departamento").value = "Lima";
        mensaje.textContent = "📍 Estás en Lima: te recomendamos Olva Courier (entrega en 1 a 2 días).";
        document.querySelector('input[value="olva"]').checked = true;
      } else {
        document.getElementById("departamento").value = "Otro";
        mensaje.textContent = "📍 Estás en provincia: te recomendamos recojo en agencia Shalom (más barato).";
        document.querySelector('input[value="shalom"]').checked = true;
      }
      actualizarResumen();
    },
    () => {
      mensaje.textContent = "No pudimos obtener tu ubicación. Selecciona tu departamento manualmente.";
    }
  );
});

// ---------- Checkout: validación del formulario ----------
document.getElementById("formCheckout").addEventListener("submit", (e) => {
  e.preventDefault();
  const error = document.getElementById("errorCheckout");
  const campos = ["nombre", "celular", "correo", "departamento", "direccion"];
  campos.forEach((c) => document.getElementById(c).classList.remove("campo-error"));

  const nombre = document.getElementById("nombre").value.trim();
  const celular = document.getElementById("celular").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const departamento = document.getElementById("departamento").value;
  const direccion = document.getElementById("direccion").value.trim();
  const pago = document.querySelector('input[name="pago"]:checked');

  let mensaje = "";
  if (carrito.length === 0) mensaje = "Tu carrito está vacío.";
  else if (nombre.length < 3) { mensaje = "Ingresa tu nombre completo."; marcar("nombre"); }
  else if (!/^9\d{8}$/.test(celular)) { mensaje = "Ingresa un celular válido (9 dígitos)."; marcar("celular"); }
  else if (!/^\S+@\S+\.\S+$/.test(correo)) { mensaje = "Ingresa un correo válido."; marcar("correo"); }
  else if (!departamento) { mensaje = "Selecciona tu departamento."; marcar("departamento"); }
  else if (direccion.length < 5) { mensaje = "Ingresa tu dirección o agencia."; marcar("direccion"); }
  else if (!pago) mensaje = "Elige un método de pago.";

  if (mensaje) {
    error.textContent = mensaje;
    return;
  }
  error.textContent = "";

  // Simulación del pedido (en producción aquí se conecta la pasarela de pago y Dropi)
  const numeroPedido = "HU-" + Math.floor(100000 + Math.random() * 900000);
  const total = calcularSubtotal() + calcularEnvio();
  const operador = document.querySelector('input[name="envio"]:checked').value === "olva" ? "Olva Courier" : "Shalom";
  document.getElementById("textoConfirmacion").innerHTML =
    `Gracias ${nombre.split(" ")[0]}, tu pedido <strong>${numeroPedido}</strong> por <strong>${soles(total)}</strong> fue registrado.<br>
     Método de pago: ${pago.value}. Envío con ${operador}.<br>
     Te enviaremos la confirmación por WhatsApp al ${celular}.`;

  document.getElementById("formCheckout").style.display = "none";
  document.getElementById("confirmacion").style.display = "block";
  carrito = [];
  guardarCarrito();
  actualizarCarrito();

  function marcar(id) {
    document.getElementById(id).classList.add("campo-error");
  }
});

// Reinicia el checkout al volver al inicio
document.querySelector(".confirmacion .btn").addEventListener("click", () => {
  document.getElementById("formCheckout").reset();
  document.getElementById("formCheckout").style.display = "block";
  document.getElementById("confirmacion").style.display = "none";
  actualizarResumen();
});

// ---------- Mobile marketing: WhatsApp y QR ----------
function linkWhatsapp(texto) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
}

document.getElementById("btnWhatsapp").href = linkWhatsapp("Hola Huellitas 🐾, quiero información sobre sus productos personalizados.");
document.getElementById("linkContacto").href = linkWhatsapp("Hola Huellitas, tengo una consulta.");

// QR que lleva a la tienda (para empaques, volantes y ferias)
const urlTienda = window.location.href.split("#")[0];
document.getElementById("qrTienda").src =
  "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(urlTienda + "?utm_source=qr&cupon=HUELLA10");

// ---------- Inicio ----------
mostrarProductos();
actualizarCarrito();

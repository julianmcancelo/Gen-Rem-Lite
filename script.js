document.addEventListener("contextmenu", e => e.preventDefault());
document.onkeydown = function(e) {
  if (e.keyCode === 123 || (e.ctrlKey && ['u', 's', 'p', 'c'].includes(e.key.toLowerCase()))) return false;
};
console.warn("%cAdvertencia", "color: red; font-size: 24px; font-weight: bold;", "No inspecciones ni copies este código.");
function agregarProducto() {
  const productos = document.getElementById('productos');
  const div = document.createElement('div');
  div.className = "grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4 relative grupo-producto";
  div.innerHTML = '<input type="text" name="sku[]" placeholder="SKU/ID" required class="border rounded-md p-2">  <input type="text" name="nombre_producto[]" placeholder="Nombre del producto" required class="border rounded-md p-2">  <input type="number" step="0.01" name="precio_unitario[]" placeholder="Precio unitario" required class="border rounded-md p-2">  <input type="number" name="cantidad[]" placeholder="Cantidad" required class="border rounded-md p-2">  <button type="button" onclick="eliminarProducto(this)" class="absolute top-1 right-1 text-red-600 hover:underline text-sm">🗑️ Eliminar</button>';
  productos.appendChild(div); actualizarBotonesEliminar();
}
function eliminarProducto(btn) {
  const grupo = btn.closest('.grupo-producto');
  const productos = document.getElementById('productos');
  if (productos.childElementCount > 1) productos.removeChild(grupo);
  actualizarBotonesEliminar();
}
function actualizarBotonesEliminar() {
  const grupos = document.querySelectorAll('.grupo-producto');
  grupos.forEach(g => {
    const btn = g.querySelector('button');
    btn.style.display = (grupos.length > 1) ? 'inline' : 'none';
  });
}
document.getElementById('usarLogo').addEventListener('change', () => {
  document.getElementById('logoInput').classList.toggle('hidden', !usarLogo.checked);
});
document.getElementById('usarQR').addEventListener('change', () => {
  document.getElementById('qrInput').classList.toggle('hidden', !usarQR.checked);
});
document.getElementById('usarCuit').addEventListener('change', () => {
  document.getElementById('cuitInput').classList.toggle('hidden', !usarCuit.checked);
});
document.getElementById('usarDireccion').addEventListener('change', () => {
  document.getElementById('direccionInput').classList.toggle('hidden', !usarDireccion.checked);
});
document.getElementById('usarTelefono').addEventListener('change', () => {
  document.getElementById('telefonoInput').classList.toggle('hidden', !usarTelefono.checked);
});
document.getElementById('usarEmail').addEventListener('change', () => {
  document.getElementById('emailInput').classList.toggle('hidden', !usarEmail.checked);
});
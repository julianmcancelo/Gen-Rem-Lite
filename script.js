document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#remitoForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20; // Inicializa la posición vertical

    // Obtener los datos del formulario
    const nombreEmprendimiento = document.querySelector('[name="nombre_emprendimiento"]').value || 'Emprendimiento';
    const nombreEmprendedor = document.querySelector('[name="nombre_emprendedor"]').value || 'Nombre';
    const cuit = document.querySelector('[name="cuit"]').value || '';
    const direccion = document.querySelector('[name="direccion"]').value || '';
    const telefono = document.querySelector('[name="telefono"]').value || '';
    const email = document.querySelector('[name="email"]').value || '';
    const alias = document.querySelector('[name="alias"]').value || 'alias.mp';

    // Configuración del encabezado con fondo rojo
    doc.setFillColor(139, 23, 40); // Rojo oscuro
    doc.rect(0, y, 210, 30, 'F'); // Fondo rojo para el encabezado
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.setFontSize(16);
    doc.text('Generador de Remito', 105, y + 15, null, null, 'center');

    y += 30; // Desplazamiento después del encabezado

    // Línea de separación en el encabezado
    doc.setDrawColor(230, 230, 230);
    doc.line(20, y, 190, y);
    y += 5; // Desplazamiento después de la línea

    // Título del remito
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Texto negro
    doc.text('Remito de Compra', 105, y, null, null, 'center');
    doc.setFontSize(10);
    doc.text('Emitido el: ' + new Date().toLocaleDateString(), 105, y + 10, null, null, 'center');

    y += 25; // Desplazamiento después del título

    // Línea de separación
    doc.setDrawColor(230, 230, 230);
    doc.line(20, y, 190, y);
    y += 5; // Desplazamiento después de la línea

    // Datos del remito (formato visual, obteniendo datos del formulario)
    doc.setFontSize(11);
    doc.setTextColor(139, 23, 40); // Rojo oscuro para los títulos
    doc.text('Datos del Emprendedor:', 20, y);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Texto negro
    doc.text(`Nombre: ${nombreEmprendimiento}`, 20, y + 10);
    doc.text(`Emprendedor: ${nombreEmprendedor}`, 20, y + 20);
    if (cuit) doc.text(`CUIT/CUIL: ${cuit}`, 20, y + 30);
    if (direccion) doc.text(`Dirección: ${direccion}`, 20, y + 40);
    if (telefono) doc.text(`Teléfono: ${telefono}`, 20, y + 50);
    if (email) doc.text(`Email: ${email}`, 20, y + 60);
    doc.text(`Alias de pago: ${alias}`, 20, y + 70);

    y += 80; // Desplazamiento después de los datos del emprendedor

    // Línea de separación después de los datos generales
    doc.setDrawColor(230, 230, 230);
    doc.line(20, y, 190, y);
    y += 5; // Desplazamiento después de la línea

    // Sección de Productos (obteniendo los datos de los productos del formulario)
    doc.setFontSize(12);
    doc.setTextColor(139, 23, 40); // Rojo oscuro
    doc.text('Productos:', 20, y);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Texto negro

    y += 10; // Desplazamiento después del título

    // Crear tabla de productos obtenidos del formulario
    const productos = document.querySelectorAll('[name="nombre_producto[]"]');
    const precios = document.querySelectorAll('[name="precio_unitario[]"]');
    const cantidades = document.querySelectorAll('[name="cantidad[]"]');

    // Encabezado de la tabla de productos
    doc.setFillColor(230, 240, 255); // Fondo de la cabecera de la tabla
    doc.rect(20, y - 5, 180, 8, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text('Producto', 20, y);
    doc.text('Precio', 120, y);
    doc.text('Cantidad', 160, y);
    doc.text('Subtotal', 175, y);
    y += 10;

    let total = 0;
    for (let i = 0; i < productos.length; i++) {
      const nombreProducto = productos[i].value;
      const precioUnitario = parseFloat(precios[i].value);
      const cantidad = parseInt(cantidades[i].value);
      const subtotal = precioUnitario * cantidad;
      total += subtotal;

      // Alternar el fondo de las filas
      const isEvenRow = i % 2 === 0;
      doc.setFillColor(isEvenRow ? 255 : 245, isEvenRow ? 255 : 245, isEvenRow ? 255 : 255); // Fondo blanco y gris claro
      doc.rect(20, y, 80, 10, 'F');
      doc.rect(120, y, 25, 10, 'F');
      doc.rect(160, y, 20, 10, 'F');
      doc.rect(175, y, 30, 10, 'F');

      doc.setTextColor(0, 0, 0);
      doc.text(nombreProducto, 20, y + 6);
      doc.text('$' + precioUnitario.toFixed(2), 120, y + 6);
      doc.text(cantidad.toString(), 160, y + 6);
      doc.text('$' + subtotal.toFixed(2), 175, y + 6);
      y += 10;
    }

    // Total
    doc.setFontSize(11);
    doc.setFillColor(230, 255, 230); // Fondo verde claro para el total
    doc.rect(20, y, 150, 10, 'F');
    doc.setTextColor(0, 0, 0); // Texto negro
    doc.text('TOTAL', 120, y + 6);
    doc.text('$' + total.toFixed(2), 175, y + 6);

    y += 20; // Desplazamiento después del total

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Este documento no reemplaza factura oficial.', 105, y, null, null, 'center');

    // Generar el PDF
    doc.save('remito.pdf');
  });
});

<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
ini_set('memory_limit', '256M');
require_once(__DIR__ . '/librerias/fpdf.php');

// Convierte a ISO-8859-1 para evitar problemas de codificación en FPDF
function safe($txt) {
    return iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $txt);
}

$nombre_emprendimiento = $_POST['nombre_emprendimiento'] ?? 'Emprendimiento';
$nombre_emprendedor = $_POST['nombre_emprendedor'] ?? 'Nombre';
$cuit = $_POST['cuit'] ?? '';
$direccion = $_POST['direccion'] ?? '';
$telefono = $_POST['telefono'] ?? '';
$email = $_POST['email'] ?? '';
$alias = $_POST['alias'] ?? 'alias.mp';
$sku = $_POST['sku'] ?? ['0001'];
$nombre_producto = $_POST['nombre_producto'] ?? ['Producto de prueba'];
$precio_unitario = $_POST['precio_unitario'] ?? [0];
$cantidad = $_POST['cantidad'] ?? [1];
$logo = (isset($_FILES['logo']['tmp_name']) && $_FILES['logo']['tmp_name']) ? $_FILES['logo']['tmp_name'] : null;
$qr = (isset($_FILES['qr']['tmp_name']) && $_FILES['qr']['tmp_name']) ? $_FILES['qr']['tmp_name'] : null;

$pdf = new FPDF('P', 'mm', 'A4');
$pdf->AddPage();
$pdf->SetMargins(20, 15, 20);

// Encabezado con fondo celeste y logo opcional
$pdf->SetFillColor(90, 170, 220);
$pdf->Rect(0, 0, 210, 30, 'F');
if ($logo && file_exists($logo)) {
    $ext_logo = pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION);
    $tmp_logo_path = __DIR__ . '/temp_pdfs/tmp_logo_' . time() . '.' . $ext_logo;
    move_uploaded_file($logo, $tmp_logo_path);
    $pdf->Image($tmp_logo_path, 15, 6, 18);
    unlink($tmp_logo_path);
}
$pdf->SetFont('Arial', 'B', 16);
$pdf->SetTextColor(255, 255, 255);
$pdf->SetY(10);
$pdf->Cell(0, 10, safe(strtoupper($nombre_emprendimiento)), 0, 1, 'C');
$pdf->SetTextColor(0, 0, 0);
$pdf->Ln(10);

// Título
$pdf->SetFont('Arial', 'B', 14);
$pdf->Cell(0, 10, safe('Remito de Compra'), 0, 1, 'C');
$pdf->SetFont('Arial', '', 10);
$pdf->Cell(0, 6, safe('Emitido el: ') . date('d/m/Y'), 0, 1, 'C');
$pdf->Ln(4);
$pdf->SetDrawColor(230, 230, 230);
$pdf->Line(20, $pdf->GetY(), 190, $pdf->GetY());
$pdf->Ln(6);

// Datos del Emprendedor
$pdf->SetFont('Arial', 'B', 11);
$pdf->SetFillColor(245, 245, 245);
$pdf->Cell(0, 8, safe('Datos del Emprendedor'), 0, 1, 'L', true);
$pdf->SetFont('Arial', '', 10);
$pdf->Cell(0, 6, safe("- Nombre: $nombre_emprendedor"), 0, 1);
if ($cuit)      $pdf->Cell(0, 6, safe("- CUIT/CUIL: $cuit"), 0, 1);
if ($direccion) $pdf->Cell(0, 6, safe("- Dirección: $direccion"), 0, 1);
if ($telefono)  $pdf->Cell(0, 6, safe("- Teléfono: $telefono"), 0, 1);
if ($email)     $pdf->Cell(0, 6, safe("- Email: $email"), 0, 1);
$pdf->Cell(0, 6, safe("- Alias de pago: $alias"), 0, 1);
$pdf->Ln(6);

// Tabla de Productos
$pdf->SetFont('Arial', 'B', 10);
$pdf->SetFillColor(230, 240, 255);
$pdf->Cell(25, 8, 'SKU', 1, 0, 'C', true);
$pdf->Cell(80, 8, 'Producto', 1, 0, 'C', true);
$pdf->Cell(25, 8, 'Precio', 1, 0, 'C', true);
$pdf->Cell(20, 8, 'Cant.', 1, 0, 'C', true);
$pdf->Cell(30, 8, 'Subtotal', 1, 1, 'C', true);

$pdf->SetFont('Arial', '', 10);
$total = 0;
for ($i = 0; $i < count($sku); $i++) {
    $sub = floatval($precio_unitario[$i]) * intval($cantidad[$i]);
    $total += $sub;
    $pdf->Cell(25, 8, safe($sku[$i]), 1, 0, 'C');
    $pdf->Cell(80, 8, safe($nombre_producto[$i]), 1, 0, 'L');
    $pdf->Cell(25, 8, '$' . number_format($precio_unitario[$i], 2), 1, 0, 'R');
    $pdf->Cell(20, 8, $cantidad[$i], 1, 0, 'C');
    $pdf->Cell(30, 8, '$' . number_format($sub, 2), 1, 1, 'R');
}

// Total
$pdf->SetFont('Arial', 'B', 11);
$pdf->SetFillColor(230, 255, 230);
$pdf->Cell(150, 10, safe('TOTAL'), 1, 0, 'R', true);
$pdf->Cell(30, 10, '$' . number_format($total, 2), 1, 1, 'R', true);

// QR centrado
if ($qr && file_exists($qr)) {
    $ext = pathinfo($_FILES['qr']['name'], PATHINFO_EXTENSION);
    $tmp_qr_path = __DIR__ . '/temp_pdfs/tmp_qr_' . time() . '.' . $ext;
    move_uploaded_file($qr, $tmp_qr_path);
    $x = (210 - 40) / 2;
    $pdf->Ln(10);
    $pdf->Image($tmp_qr_path, $x, $pdf->GetY(), 40);
    unlink($tmp_qr_path);
    $pdf->Ln(5);
    $pdf->SetFont('Arial', 'I', 9);
    $pdf->Cell(0, 6, safe('QR para pago'), 0, 1, 'C');
}

// Footer
$pdf->Ln(8);
$pdf->SetFont('Arial', 'I', 8);
$pdf->SetTextColor(100, 100, 100);
$pdf->SetY(-15);
$pdf->Cell(0, 6, safe('Este documento no reemplaza factura oficial.'), 0, 1, 'C');

// Guardar PDF
$dir = __DIR__ . '/temp_pdfs';
if (!file_exists($dir)) mkdir($dir, 0777, true);
foreach (glob($dir . '/*.pdf') as $file) {
    if (is_file($file) && time() - filemtime($file) > 1800) unlink($file);
}
$filename = 'remito_' . time() . '.pdf';
$path = $dir . '/' . $filename;
$pdf->Output('F', $path);
header('Location: ver_pdf.php?archivo=' . urlencode($filename));
exit;
?>

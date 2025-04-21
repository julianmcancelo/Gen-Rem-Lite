<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$archivo = $_GET['archivo'] ?? '';
$ruta = __DIR__ . '/temp_pdfs/' . basename($archivo);

if (!file_exists($ruta)) {
    die('PDF no encontrado o expirado.');
}

header('Content-Type: application/pdf');
header('Content-Disposition: inline; filename="' . basename($archivo) . '"');
readfile($ruta);
exit;
?>
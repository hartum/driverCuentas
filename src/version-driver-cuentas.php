<?php
// Configurar el encabezado HTTP para indicar que la respuesta es JSON
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// Crear un array asociativo con los datos que quieres devolver
$response = array(
    "app" => "driverCuentas",
    "ver" => "2.0.3",
);

// Convertir el array a JSON
echo json_encode($response);
?>
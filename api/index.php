<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Responder requisições preflight OPTIONS (crucial!)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


$method = $_SERVER['REQUEST_METHOD'];
$request = $_GET['request'] ?? '';

require_once 'config/Database.php';

$db = (new Database())->getConnection();


switch ($request) {
    case 'usuarios':
        require_once 'routes/usuarios.php';
        break;
    case 'filmes':
        require_once 'routes/filmes.php';
        break;
    case 'generos':
        require_once 'routes/generos.php';
        break;
    case 'estatisticas':
        require_once 'routes/estatisticas.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(["message" => "Rota não encontrada."]);
}
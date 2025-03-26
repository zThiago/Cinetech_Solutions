<?php
require_once './controllers/GeneroController.php';

$controller = new GeneroController($db);

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        $response = $id ? $controller->obterGeneroPorId($id) : $controller->listarGeneros();
        break;

    case 'POST':
        $dados = json_decode(file_get_contents('php://input'), true);
        $response = $controller->criarGenero($dados);
        break;

    case 'PUT':
        $id = $_GET['id'] ?? null;
        $dados = json_decode(file_get_contents('php://input'), true);
        $response = $controller->atualizarGenero($id, $dados);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        $response = $controller->excluirGenero($id);
        break;

    default:
        http_response_code(405);
        $response = ["message" => "Método não permitido"];
}

echo json_encode($response);

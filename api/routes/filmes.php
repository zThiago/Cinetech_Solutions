<?php
require_once './controllers/FilmeController.php';

$controller = new FilmeController($db);

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        $response = $id ? $controller->obterFilmePorId($id) : $controller->listarFilmes();
        break;

    case 'POST':
        $dados = json_decode(file_get_contents('php://input'), true);
        $response = $controller->criarFilme($dados);
        break;

    case 'PUT':
        $id = $_GET['id'] ?? null;
        $dados = json_decode(file_get_contents('php://input'), true);
        $response = $controller->atualizarFilme($id, $dados);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        $response = $controller->excluirFilme($id);
        break;

    default:
        http_response_code(405);
        $response = ["message" => "Método não permitido"];
}

echo json_encode($response);

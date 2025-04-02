<?php
require_once './controllers/UsuarioController.php';

$controller = new UsuarioController($db);
$acao = $_GET['acao'] ?? '';
$id = $_GET['id'] ?? null;

$method = $_SERVER['REQUEST_METHOD'];

// Rota especial para login
if ($method === 'POST' && $acao === 'login') {
  $dados = json_decode(file_get_contents("php://input"), true);
  echo json_encode($controller->login($dados['email'], $dados['senha']));
  exit();
}

// CRUD completo
switch ($method) {
  case 'GET':
    echo json_encode($controller->readAll());
    break;

  case 'POST':
    $dados = json_decode(file_get_contents("php://input"), true);
    echo json_encode($controller->create($dados));
    break;

  case 'PUT':
    $dados = json_decode(file_get_contents("php://input"), true);
    echo json_encode($controller->update($id, $dados));
    break;

  case 'DELETE':
    echo json_encode($controller->delete($id));
    break;

  default:
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método não permitido"]);
    break;
}

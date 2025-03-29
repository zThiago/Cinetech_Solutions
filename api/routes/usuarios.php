<?php
require_once './controllers/UsuarioController.php';

$controller = new UsuarioController($db);

// Obtém ação pela URL, padrão para "login"
$acao = $_GET['acao'] ?? '';

switch ($acao) {
    case 'login':
        // Recebe dados de entrada (JSON)
        $dados = json_decode(file_get_contents('php://input'), true);

        // Chama método login que iremos criar no controller
        $response = $controller->login($dados['email'], $dados['senha']);
        break;

    default:
        http_response_code(400);
        $response = ["success" => false, "message" => "Ação não especificada ou inválida."];
}

echo json_encode($response);

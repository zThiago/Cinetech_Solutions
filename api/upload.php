<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método não permitido"]);
    exit();
}

if (!isset($_FILES['imagem'])) {
    echo json_encode(["success" => false, "message" => "Nenhum arquivo enviado."]);
    exit();
}

$arquivo = $_FILES['imagem'];
$ext = pathinfo($arquivo['name'], PATHINFO_EXTENSION);
$nomeArquivo = uniqid() . '.' . $ext;
$caminho = '../frontend/uploads/' . $nomeArquivo;

if (move_uploaded_file($arquivo['tmp_name'], $caminho)) {
    echo json_encode([
        "success" => true,
        "arquivo" => 'uploads/' . $nomeArquivo
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Erro ao salvar imagem."]);
}

<?php
include_once 'controllers/UsuarioController.php';

$usuarioCtrl = new UsuarioController();

$resultado = $usuarioCtrl->cadastrarUsuario([
    "nome" => "Admin",
    "email" => "admin@teste.com",
    "senha" => "123456",
    "imagem_perfil" => null,
    "is_admin" => true
]);

echo json_encode($resultado);

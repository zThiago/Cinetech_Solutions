<?php
require_once './models/Filme.php';
require_once './models/Genero.php';
require_once './models/Usuario.php';
require_once './config/Database.php';

$db = (new Database())->getConnection();

$filme = new Filme($db);
$genero = new Genero($db);
$usuario = new Usuario($db);

$response = [
  "filmes" => count($filme->readAll()),
  "generos" => count($genero->readAll()),
  "usuarios" => count($usuario->readAll())
];

echo json_encode(["success" => true, "data" => $response]);

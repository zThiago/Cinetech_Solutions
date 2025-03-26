<?php
include_once './config/Database.php';
include_once './models/Usuario.php';

class UsuarioController {
    private $db;
    private $usuario;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->usuario = new Usuario($this->db);
    }

    // Exemplo: Cadastrar novo usuário
    public function cadastrarUsuario($dadosUsuario) {
        $this->usuario->nome = $dadosUsuario['nome'];
        $this->usuario->email = $dadosUsuario['email'];
        $this->usuario->senha = $dadosUsuario['senha'];
        $this->usuario->imagem_perfil = $dadosUsuario['imagem_perfil'];
        $this->usuario->is_admin = $dadosUsuario['is_admin'];

        if($this->usuario->create()) {
            return ["success" => true, "message" => "Usuário cadastrado com sucesso!"];
        } else {
            return ["success" => false, "message" => "Erro ao cadastrar usuário."];
        }
    }
}

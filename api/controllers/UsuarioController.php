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

    public function login($email, $senha) {
        if (empty($email) || empty($senha)) {
            return ["success" => false, "message" => "Email e senha são obrigatórios."];
        }
    
        $this->usuario->email = htmlspecialchars(strip_tags($email));
        $usuario = $this->usuario->readByEmail();
    
        if ($usuario && password_verify($senha, $usuario->senha)) {
            // Remova a senha antes de retornar por segurança
            unset($usuario->senha);
    
            return [
                "success" => true,
                "message" => "Login realizado com sucesso!",
                "data" => $usuario
            ];
        }
    
        return ["success" => false, "message" => "Email ou senha incorretos."];
    }
}

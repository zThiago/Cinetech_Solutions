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

    public function create($dados) {
        if (empty($dados['nome']) || empty($dados['email'])) {
          return ["success" => false, "message" => "Nome e email são obrigatórios."];
        }
      
        $this->usuario->nome = htmlspecialchars(strip_tags($dados['nome']));
        $this->usuario->email = htmlspecialchars(strip_tags($dados['email']));
        $this->usuario->is_admin = $dados['is_admin'] ?? 0;
      
        if (!empty($dados['senha'])) {
          $this->usuario->senha = password_hash($dados['senha'], PASSWORD_DEFAULT);
        } else {
          return ["success" => false, "message" => "Senha é obrigatória para novos usuários."];
        }
      
        if ($this->usuario->create()) {
          return ["success" => true, "message" => "Usuário criado com sucesso"];
        } else {
          return ["success" => false, "message" => "Erro ao criar usuário"];
        }
      }

      public function readAll() {
        $stmt = $this->usuario->readAll(); // <- this is array
        $usuarios = [];
      
        for( $i = 0; $i < count($stmt); $i++ ) {
          $usuarios[$i] = $stmt[$i];
        }
      
        return ["success" => true, "data" => $usuarios];
      }
      
      
      public function update($id, $dados) {
        if (!$id) return ["success" => false, "message" => "ID não informado"];
        $usuarioCurrentData = $this->usuario->readById($id);      


        $this->usuario->id = $id;
        $this->usuario->nome = htmlspecialchars(strip_tags($dados['nome'] ?? $usuarioCurrentData->nome));
        $this->usuario->email = htmlspecialchars(strip_tags($dados['email'] ?? $usuarioCurrentData->email));
        $this->usuario->is_admin = $dados['is_admin'] ?? $usuarioCurrentData->is_admin;
        $this->usuario->imagem_perfil = $dados['imagem_perfil'] ?? $usuarioCurrentData->imagem_perfil;
      
        if (!empty($dados['senha'])) {
          $this->usuario->senha = password_hash($dados['senha'], PASSWORD_DEFAULT);
        } else {
          $this->usuario->senha = null; 
        }
      
        if ($this->usuario->update()) {
          return ["success" => true, "message" => "Usuário atualizado"];
        } else {
          return ["success" => false, "message" => "Erro ao atualizar usuário"];
        }
      }
      
      public function delete($id) {
        if (!$id) return ["success" => false, "message" => "ID não informado"];
      
        $this->usuario->id = $id;
      
        if ($this->usuario->delete()) {
          return ["success" => true, "message" => "Usuário excluído"];
        } else {
          return ["success" => false, "message" => "Erro ao excluir usuário"];
        }
      }
      
}

<?php
class Usuario {
    private $conn;
    private $table_name = "usuarios";

    public $id;
    public $nome;
    public $email;
    public $senha;
    public $imagem_perfil;
    public $is_admin;
    public $criado_em;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Criar usuário
    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  SET nome=:nome, email=:email, senha=:senha, imagem_perfil=:imagem_perfil, is_admin=:is_admin";

        $stmt = $this->conn->prepare($query);

        // Limpeza
        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->senha = password_hash($this->senha, PASSWORD_BCRYPT);
        $this->imagem_perfil = htmlspecialchars(strip_tags($this->imagem_perfil));
        $this->is_admin = $this->is_admin ? 1 : 0;

        // Bind de valores
        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":senha", $this->senha);
        $stmt->bindParam(":imagem_perfil", $this->imagem_perfil);
        $stmt->bindParam(":is_admin", $this->is_admin);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Ler usuário por email
    public function readByEmail() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE email=:email LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(":email", $this->email);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_OBJ);
    }
}

<?php
/**
 * Classe Genero - representa um gênero de filme e fornece métodos CRUD para a tabela de gêneros.
 */
class Genero {
    // Conexão com o banco de dados (PDO)
    private $conn;
    // Nome da tabela de gêneros no banco de dados
    private $table = "generos";

    // Atributos do gênero (colunas da tabela de generos)
    public $id;
    public $nome;
    public $descricao;

    /**
     * Construtor da classe Genero.
     * Recebe uma conexão PDO para interagir com o banco de dados.
     */
    public function __construct($pdo) {
        $this->conn = $pdo;
    }

    /**
     * Cria um novo gênero no banco de dados.
     * @param array $dados Dados do gênero (nome, descricao).
     * @return mixed Retorna o ID do novo gênero em caso de sucesso, ou false em caso de falha.
     */
    public function create($dados) {
        // Sanitiza os dados de entrada
        $nome = htmlspecialchars(strip_tags($dados['nome'] ?? ''));
        $descricao = htmlspecialchars(strip_tags($dados['descricao'] ?? ''));

        // Prepara e executa a inserção do novo gênero
        $sql = "INSERT INTO " . $this->table . " (nome, descricao) VALUES (:nome, :descricao)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':descricao', $descricao);
        if ($stmt->execute()) {
            // Retorna o ID do gênero inserido em caso de sucesso
            return $this->conn->lastInsertId();
        } else {
            return false;
        }
    }

    /**
     * Retorna todos os gêneros cadastrados no banco de dados.
     * @return mixed Lista de gêneros como array associativo, ou false em caso de falha.
     */
    public function readAll() {
        $sql = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($sql);
        if ($stmt->execute()) {
            // Retorna todos os registros de gêneros
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            return false;
        }
    }

    /**
     * Retorna um gênero pelo ID.
     * @param int $id ID do gênero a ser buscado.
     * @return mixed Dados do gênero (array associativo) ou false se não encontrado.
     */
    public function readById($id) {
        $id = intval($id);
        $sql = "SELECT * FROM " . $this->table . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        if ($stmt->execute()) {
            if ($stmt->rowCount() > 0) {
                // Retorna os dados do gênero encontrado
                return $stmt->fetch(PDO::FETCH_ASSOC);
            } else {
                return false;  // Nenhum gênero com esse ID
            }
        } else {
            return false;
        }
    }

    /**
     * Atualiza os dados de um gênero existente.
     * @param int $id ID do gênero a ser atualizado.
     * @param array $dados Dados do gênero (nome, descricao) a serem atualizados.
     * @return bool Retorna true em caso de sucesso ou false em caso de falha.
     */
    public function update($id, $dados) {
        $id = intval($id);
        // Sanitiza os valores de entrada
        $nome = htmlspecialchars(strip_tags($dados['nome'] ?? ''));
        $descricao = htmlspecialchars(strip_tags($dados['descricao'] ?? ''));
        // Prepara o comando de atualização
        $sql = "UPDATE " . $this->table . " SET nome = :nome, descricao = :descricao WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':descricao', $descricao);
        $stmt->bindParam(':id', $id);
        if ($stmt->execute()) {
            // Retorna true se alguma linha foi afetada (gênero existia e foi alterado)
            return ($stmt->rowCount() > 0);
        } else {
            return false;
        }
    }

    /**
     * Exclui um gênero do banco de dados.
     * Remove também quaisquer associações desse gênero com filmes na tabela de ligação.
     * @param int $id ID do gênero a ser excluído.
     * @return bool Retorna true em caso de sucesso ou false em caso de falha.
     */
    public function delete($id) {
        $id = intval($id);
        // Remove associações na tabela filmes_generos antes de excluir o gênero
        $stmtPivot = $this->conn->prepare("DELETE FROM filmes_generos WHERE genero_id = :genero_id");
        $stmtPivot->bindParam(':genero_id', $id);
        $stmtPivot->execute();
        // Exclui o gênero na tabela de generos
        $stmt = $this->conn->prepare("DELETE FROM " . $this->table . " WHERE id = :id");
        $stmt->bindParam(':id', $id);
        if ($stmt->execute()) {
            // Retorna true se um registro foi deletado
            return ($stmt->rowCount() > 0);
        } else {
            return false;
        }
    }
}
?>

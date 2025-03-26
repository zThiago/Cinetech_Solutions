<?php
/**
 * Classe Filme - representa um filme e fornece metodos para operações CRUD no banco de dados.
 * Inclui relacionamento muitos-para-muitos com a classe Gênero atraves da tabela cinetech.
 */
class Filme {
    // Conexão com o banco de dados (PDO)
    private $conn;
    // Nome da tabela de filmes no banco de dados
    private $table = "filmes";

    // Atributos do filme (colunas da tabela de filmes)
    public $id;
    public $titulo;
    public $descricao;
    public $capa;
    public $link_trailer;
    public $data_lancamento;
    public $duracao;
    public $criado_em;

    /**
     * Construtor da classe Filme.
     * Recebe uma conexão PDO para interagir com o banco de dados.
     */
    public function __construct($pdo) {
        $this->conn = $pdo;
    }

    /**
     * Cria um novo filme no banco de dados e configura suas associações de gênero.
     * @param array $dados Dados do filme (titulo, descricao, capa, link_trailer, data_lancamento, duracao, [generos])
     * @return mixed Retorna o ID do novo filme em caso de sucesso, ou false em caso de falha.
     */
    public function create($dados) {
        // Sanitiza os dados de entrada (removendo tags HTML/JS)
        $titulo = htmlspecialchars(strip_tags($dados['titulo'] ?? ''));
        $descricao = htmlspecialchars(strip_tags($dados['descricao'] ?? ''));
        $capa = htmlspecialchars(strip_tags($dados['capa'] ?? ''));
        $link_trailer = htmlspecialchars(strip_tags($dados['link_trailer'] ?? ''));
        $data_lancamento = htmlspecialchars(strip_tags($dados['data_lancamento'] ?? ''));
        $duracao = htmlspecialchars(strip_tags($dados['duracao'] ?? ''));

        // Prepara o comando SQL para inserir um novo filme
        $sql = "INSERT INTO " . $this->table . " 
                (titulo, descricao, capa, link_trailer, data_lancamento, duracao) 
                VALUES (:titulo, :descricao, :capa, :link_trailer, :data_lancamento, :duracao)";
        $stmt = $this->conn->prepare($sql);

        // Vincula os parametros com os valores sanitizados
        $stmt->bindParam(':titulo', $titulo);
        $stmt->bindParam(':descricao', $descricao);
        $stmt->bindParam(':capa', $capa);
        $stmt->bindParam(':link_trailer', $link_trailer);
        $stmt->bindParam(':data_lancamento', $data_lancamento);
        $stmt->bindParam(':duracao', $duracao);

        // Executa a inserção do filme no banco de dados
        if ($stmt->execute()) {
            // Pega o ID gerado para o novo filme
            $novoId = $this->conn->lastInsertId();
            $this->id = $novoId; // atualiza o atributo id do objeto - opcional

            // Se houver gêneros associados fornecidos, insere cada associação na tabela filmes_generos
            if (!empty($dados['generos']) && is_array($dados['generos'])) {
                foreach ($dados['generos'] as $generoId) {
                    // Garante que o ID do genero seja um número inteiro para segurança
                    $generoIdLimpo = intval($generoId);
                    $sqlPivot = "INSERT INTO filmes_generos (filme_id, genero_id) 
                                 VALUES (:filme_id, :genero_id)";
                    $stmtPivot = $this->conn->prepare($sqlPivot);
                    $stmtPivot->bindParam(':filme_id', $novoId);
                    $stmtPivot->bindParam(':genero_id', $generoIdLimpo);
                    $stmtPivot->execute();
                }
            }
            return $novoId;
        } else {
            // Em caso de falha na execução, retorna false
            return false;
        }
    }

    /**
     * Recupera todos os filmes do banco de dados.
     * @return mixed Retorna uma lista (array) de filmes (cada filme como array associativo, incluindo seus gêneros) ou false em caso de falha.
     */
    public function readAll() {
        $sql = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($sql);
        if ($stmt->execute()) {
            // Busca todos os registros de filmes
            $filmes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            // Para cada filme, recupera os gêneros associados (relacionamento muitos-para-muitos)
            foreach ($filmes as &$filme) {
                $filmeId = $filme['id'];
                $sqlGeneros = "SELECT g.id, g.nome, g.descricao 
                               FROM generos g 
                               JOIN filmes_generos fg ON g.id = fg.genero_id 
                               WHERE fg.filme_id = :filme_id";
                $stmtGen = $this->conn->prepare($sqlGeneros);
                $stmtGen->bindParam(':filme_id', $filmeId);
                $stmtGen->execute();
                // Obtem todos os generos do filme atual
                $generos = $stmtGen->fetchAll(PDO::FETCH_ASSOC);
                // Adiciona os generos ao array do filme
                $filme['generos'] = $generos;
            }
            return $filmes;
        } else {
            return false;
        }
    }

    /**
     * Recupera um filme pelo ID, incluindo seus gêneros associados.
     * @param int $id ID do filme a ser buscado.
     * @return mixed Retorna um array associativo com os dados do filme (e seus gêneros) ou false se não encontrado.
     */
    public function readById($id) {
        $id = intval($id);  // garante que o ID seja inteiro
        $sql = "SELECT * FROM " . $this->table . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        if ($stmt->execute()) {
            if ($stmt->rowCount() > 0) {
                // Filme encontrado: obtém dados do filme
                $filme = $stmt->fetch(PDO::FETCH_ASSOC);
                // Busca os gêneros associados a esse filme
                $sqlGeneros = "SELECT g.id, g.nome, g.descricao 
                               FROM generos g 
                               JOIN filmes_generos fg ON g.id = fg.genero_id 
                               WHERE fg.filme_id = :filme_id";
                $stmtGen = $this->conn->prepare($sqlGeneros);
                $stmtGen->bindParam(':filme_id', $id);
                $stmtGen->execute();
                $generos = $stmtGen->fetchAll(PDO::FETCH_ASSOC);
                // Adiciona a lista de gêneros ao array do filme
                $filme['generos'] = $generos;
                return $filme;
            } else {
                // Nenhum filme encontrado com este ID
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Atualiza os dados de um filme existente no banco de dados.
     * @param int $id ID do filme a ser atualizado.
     * @param array $dados Dados do filme (titulo, descricao, capa, link_trailer, data_lancamento, duracao, [generos]) a serem atualizados.
     * @return bool Retorna true em caso de sucesso ou false em caso de falha.
     */
    public function update($id, $dados) {
        $id = intval($id);
        // Sanitiza os novos valores dos campos
        $titulo = htmlspecialchars(strip_tags($dados['titulo'] ?? ''));
        $descricao = htmlspecialchars(strip_tags($dados['descricao'] ?? ''));
        $capa = htmlspecialchars(strip_tags($dados['capa'] ?? ''));
        $link_trailer = htmlspecialchars(strip_tags($dados['link_trailer'] ?? ''));
        $data_lancamento = htmlspecialchars(strip_tags($dados['data_lancamento'] ?? ''));
        $duracao = htmlspecialchars(strip_tags($dados['duracao'] ?? ''));

        // Prepara o comando SQL para atualização
        $sql = "UPDATE " . $this->table . " 
                SET titulo = :titulo, descricao = :descricao, capa = :capa, 
                    link_trailer = :link_trailer, data_lancamento = :data_lancamento, duracao = :duracao 
                WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        // Vincula os valores atualizados aos parâmetros
        $stmt->bindParam(':titulo', $titulo);
        $stmt->bindParam(':descricao', $descricao);
        $stmt->bindParam(':capa', $capa);
        $stmt->bindParam(':link_trailer', $link_trailer);
        $stmt->bindParam(':data_lancamento', $data_lancamento);
        $stmt->bindParam(':duracao', $duracao);
        $stmt->bindParam(':id', $id);

        // Executa a atualização do filme
        if ($stmt->execute()) {
            // Se gêneros foram fornecidos para atualização, atualiza a tabela de associação
            if (isset($dados['generos']) && is_array($dados['generos'])) {
                // Remove as associações antigas do filme na tabela filmes_generos
                $stmtDel = $this->conn->prepare("DELETE FROM filmes_generos WHERE filme_id = :filme_id");
                $stmtDel->bindParam(':filme_id', $id);
                $stmtDel->execute();
                // Insere as novas associações de gêneros (se a lista estiver vazia, apenas removeu as antigas)
                foreach ($dados['generos'] as $generoId) {
                    $generoIdLimpo = intval($generoId);
                    $stmtPivot = $this->conn->prepare("INSERT INTO filmes_generos (filme_id, genero_id) 
                                                       VALUES (:filme_id, :genero_id)");
                    $stmtPivot->bindParam(':filme_id', $id);
                    $stmtPivot->bindParam(':genero_id', $generoIdLimpo);
                    $stmtPivot->execute();
                }
            }
            // Verifica se alguma linha do registro principal foi afetada (id existente e dados possivelmente alterados)
            return ($stmt->rowCount() > 0);
        } else {
            return false;
        }
    }

    /**
     * Exclui um filme do banco de dados pelo ID.
     * Remove também as relações desse filme com quaisquer gêneros na tabela de associação.
     * @param int $id ID do filme a ser excluído.
     * @return bool Retorna true em caso de sucesso ou false em caso de falha.
     */
    public function delete($id) {
        $id = intval($id);
        // Remove primeiro as ligações na tabela de associação (filmes_generos) para este filme
        $stmtPivot = $this->conn->prepare("DELETE FROM filmes_generos WHERE filme_id = :filme_id");
        $stmtPivot->bindParam(':filme_id', $id);
        $stmtPivot->execute();
        // Em seguida, remove o filme na tabela principal de filmes
        $stmt = $this->conn->prepare("DELETE FROM " . $this->table . " WHERE id = :id");
        $stmt->bindParam(':id', $id);
        if ($stmt->execute()) {
            // Verifica se o filme foi realmente excluído (se uma linha foi afetada)
            return ($stmt->rowCount() > 0);
        } else {
            return false;
        }
    }
}
?>

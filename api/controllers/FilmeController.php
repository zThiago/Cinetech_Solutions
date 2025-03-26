<?php
require_once __DIR__ . '/../models/Filme.php';  // Inclui a classe Filme (model)

/**
 * Controller FilmeController - gerencia as requisições relacionadas a Filmes.
 * Utiliza a classe Filme (model) para executar operações CRUD e formatar as respostas da API.
 */
class FilmeController {
    private $model;

    /**
     * Construtor do FilmeController.
     * @param PDO $pdo Conexão PDO a ser utilizada pelo model Filme.
     */
    public function __construct($pdo) {
        // Inicializa o model Filme com a conexão recebida
        $this->model = new Filme($pdo);
    }

    /**
     * Cria um novo filme utilizando os dados fornecidos.
     * @param array $dados Dados do filme (titulo, descricao, capa, link_trailer, data_lancamento, duracao, [generos]).
     * @return array Resposta da operação (sucesso ou erro, com mensagem).
     */
    public function criarFilme($dados) {
        // Validação básica dos campos obrigatórios
        if (empty($dados['titulo']) || empty($dados['descricao']) || 
            empty($dados['data_lancamento']) || empty($dados['duracao'])) {
            return [
                "success" => false,
                "message" => "Dados insuficientes para criar o filme. Certifique-se de fornecer título, descrição, data de lançamento e duração."
            ];
        }
        // Chama o model para criar o filme
        $resultado = $this->model->create($dados);
        if ($resultado !== false) {
            // Sucesso na criação do filme
            return [
                "success" => true,
                "message" => "Filme criado com sucesso.",
                "id" => $resultado  // ID do novo filme criado
            ];
        } else {
            // Falha na criação do filme
            return [
                "success" => false,
                "message" => "Erro ao criar filme."
            ];
        }
    }

    /**
     * Retorna a lista de todos os filmes cadastrados.
     * @return array Resposta contendo sucesso/erro e os dados dos filmes (se houver).
     */
    public function listarFilmes() {
        $dados = $this->model->readAll();
        if ($dados !== false) {
            // Retorna os filmes em caso de sucesso (mesmo que array esteja vazio, considera sucesso)
            return [
                "success" => true,
                "data" => $dados
            ];
        } else {
            // Falha ao recuperar filmes
            return [
                "success" => false,
                "message" => "Erro ao buscar filmes."
            ];
        }
    }

    /**
     * Retorna os detalhes de um filme específico pelo ID.
     * @param int $id ID do filme a ser consultado.
     * @return array Resposta contendo sucesso/erro e os dados do filme (se encontrado).
     */
    public function obterFilmePorId($id) {
        if (empty($id)) {
            return [
                "success" => false,
                "message" => "ID do filme não fornecido."
            ];
        }
        $resultado = $this->model->readById($id);
        if ($resultado !== false) {
            // Filme encontrado, retorna seus dados
            return [
                "success" => true,
                "data" => $resultado
            ];
        } else {
            // Filme não encontrado
            return [
                "success" => false,
                "message" => "Filme não encontrado."
            ];
        }
    }

    /**
     * Atualiza um filme existente com os novos dados fornecidos.
     * @param int $id ID do filme a ser atualizado.
     * @param array $dados Novos dados do filme.
     * @return array Resposta contendo sucesso/erro e mensagem correspondente.
     */
    public function atualizarFilme($id, $dados) {
        if (empty($id) || empty($dados['titulo']) || empty($dados['descricao']) || 
            empty($dados['data_lancamento']) || empty($dados['duracao'])) {
            return [
                "success" => false,
                "message" => "Dados insuficientes para atualizar o filme ou ID não informado."
            ];
        }
        $sucesso = $this->model->update($id, $dados);
        if ($sucesso) {
            return [
                "success" => true,
                "message" => "Filme atualizado com sucesso."
            ];
        } else {
            return [
                "success" => false,
                "message" => "Erro ao atualizar filme."
            ];
        }
    }

    /**
     * Exclui um filme pelo ID fornecido.
     * @param int $id ID do filme a ser excluído.
     * @return array Resposta contendo sucesso/erro e mensagem correspondente.
     */
    public function excluirFilme($id) {
        if (empty($id)) {
            return [
                "success" => false,
                "message" => "ID do filme não fornecido."
            ];
        }
        $sucesso = $this->model->delete($id);
        if ($sucesso) {
            return [
                "success" => true,
                "message" => "Filme excluído com sucesso."
            ];
        } else {
            return [
                "success" => false,
                "message" => "Erro ao excluir filme."
            ];
        }
    }
}
?>

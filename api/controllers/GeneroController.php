<?php
require_once __DIR__ . '/../models/Genero.php';  // Inclui a classe Genero (model)

/**
 * Controller GeneroController - gerencia as requisições relacionadas a Gêneros.
 * Utiliza a classe Genero (model) para executar operações CRUD e formatar as respostas.
 */
class GeneroController {
    private $model;

    /**
     * Construtor do GeneroController.
     * @param PDO $pdo Conexão PDO a ser utilizada pelo model Genero.
     */
    public function __construct($pdo) {
        $this->model = new Genero($pdo);
    }

    /**
     * Cria um novo gênero com os dados fornecidos.
     * @param array $dados Dados do gênero (nome, descricao).
     * @return array Resposta contendo sucesso/erro e mensagem correspondente.
     */
    public function criarGenero($dados) {
        // Verifica se o campo obrigatório 'nome' foi fornecido
        if (empty($dados['nome'])) {
            return [
                "success" => false,
                "message" => "Nome do gênero é obrigatório."
            ];
        }
        $resultado = $this->model->create($dados);
        if ($resultado !== false) {
            return [
                "success" => true,
                "message" => "Gênero criado com sucesso.",
                "id" => $resultado  // ID do novo gênero criado
            ];
        } else {
            return [
                "success" => false,
                "message" => "Erro ao criar gênero."
            ];
        }
    }

    /**
     * Retorna a lista de todos os gêneros.
     * @return array Resposta contendo sucesso/erro e a lista de gêneros (se houver).
     */
    public function listarGeneros() {
        $dados = $this->model->readAll();
        if ($dados !== false) {
            return [
                "success" => true,
                "data" => $dados
            ];
        } else {
            return [
                "success" => false,
                "message" => "Erro ao buscar gêneros."
            ];
        }
    }

    /**
     * Retorna os detalhes de um gênero específico pelo ID.
     * @param int $id ID do gênero a ser consultado.
     * @return array Resposta contendo sucesso/erro e os dados do gênero (se encontrado).
     */
    public function obterGeneroPorId($id) {
        if (empty($id)) {
            return [
                "success" => false,
                "message" => "ID do gênero não fornecido."
            ];
        }
        $resultado = $this->model->readById($id);
        if ($resultado !== false) {
            return [
                "success" => true,
                "data" => $resultado
            ];
        } else {
            return [
                "success" => false,
                "message" => "Gênero não encontrado."
            ];
        }
    }

    /**
     * Atualiza um gênero existente com os novos dados fornecidos.
     * @param int $id ID do gênero a ser atualizado.
     * @param array $dados Novos dados do gênero.
     * @return array Resposta contendo sucesso/erro e mensagem correspondente.
     */
    public function atualizarGenero($id, $dados) {
        if (empty($id) || empty($dados['nome'])) {
            return [
                "success" => false,
                "message" => "ID do gênero ou nome não fornecido."
            ];
        }
        $sucesso = $this->model->update($id, $dados);
        if ($sucesso) {
            return [
                "success" => true,
                "message" => "Gênero atualizado com sucesso."
            ];
        } else {
            return [
                "success" => false,
                "message" => "Erro ao atualizar gênero."
            ];
        }
    }

    /**
     * Exclui um gênero pelo ID.
     * @param int $id ID do gênero a ser excluído.
     * @return array Resposta contendo sucesso/erro e mensagem correspondente.
     */
    public function excluirGenero($id) {
        if (empty($id)) {
            return [
                "success" => false,
                "message" => "ID do gênero não fornecido."
            ];
        }
        $sucesso = $this->model->delete($id);
        if ($sucesso) {
            return [
                "success" => true,
                "message" => "Gênero excluído com sucesso."
            ];
        } else {
            return [
                "success" => false,
                "message" => "Erro ao excluir gênero."
            ];
        }
    }
}
?>

const API_URL = 'http://localhost/cinetech/api/';

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link');
    const painel = document.getElementById('painelConteudo');
    
    let generoModal;

    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        // Atualiza destaque no menu
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
  
        const page = link.getAttribute('data-page');
  
        switch (page) {
          case 'inicio':
            painel.innerHTML = `
              <h3>Bem-vindo à Área Administrativa</h3>
              <p>Escolha uma opção no menu à esquerda para começar.</p>`;
            break;
          case 'filmes':
            carregarGerenciadorFilmes();
            break;
          case 'generos':
            carregarGerenciadorGeneros();
            break;
        }
      });
    });
  });
  
  function carregarGerenciadorFilmes() {
    const painel = document.getElementById('painelConteudo');
    painel.innerHTML = `
      <h4>Gerenciar Filmes</h4>
      <button class="btn btn-success mb-3" onclick="abrirModalFilme()">+ Novo Filme</button>
      <table class="table table-dark table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Gêneros</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody id="tabelaFilmes">
          <tr><td colspan="4">Carregando...</td></tr>
        </tbody>
      </table>
  
      <!-- Modal Filme -->
      <div class="modal fade" id="modalFilme" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content bg-dark text-white">
            <div class="modal-header">
              <h5 class="modal-title" id="tituloModalFilme">Novo Filme</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <input type="hidden" id="filmeId">
              <div class="row">
                <div class="col-md-6">
                  <label class="form-label">Título</label>
                  <input type="text" class="form-control mb-2" id="filmeTitulo">
                  <label class="form-label">Descrição</label>
                  <textarea class="form-control mb-2" id="filmeDescricao"></textarea>
                  <label class="form-label">Trailer (URL)</label>
                  <input type="url" class="form-control mb-2" id="filmeTrailer">
                  <label class="form-label">Duração (minutos)</label>
                  <input type="number" class="form-control mb-2" id="filmeDuracao">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Data de Lançamento</label>
                  <input type="date" class="form-control mb-2" id="filmeData">
                  <label class="form-label">Capa (URL ou upload futuramente)</label>
                  <input type="text" class="form-control mb-2" id="filmeCapa">
                  <label class="form-label">Gêneros</label>
                  <div id="listaGeneros" class="d-flex flex-wrap gap-2"></div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button class="btn btn-primary" onclick="salvarFilme()">Salvar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  
    buscarFilmes();
  }
  
  let filmeModal;

async function buscarFilmes() {
  const res = await fetch(API_URL+'?request=filmes');
  const data = await res.json();

  const tabela = document.getElementById('tabelaFilmes');
  tabela.innerHTML = '';

  if (data.success) {
    data.data.forEach(filme => {
      const generos = filme.generos.map(g => g.nome).join(', ');
      tabela.innerHTML += `
        <tr>
          <td>${filme.id}</td>
          <td>${filme.titulo}</td>
          <td>${generos}</td>
          <td>
            <button class="btn btn-warning btn-sm me-1" onclick='editarFilme(${JSON.stringify(filme)})'>
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="excluirFilme(${filme.id})">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });
  } else {
    tabela.innerHTML = `<tr><td colspan="4">Erro ao carregar filmes</td></tr>`;
  }
}

async function abrirModalFilme() {
  document.getElementById('tituloModalFilme').innerText = 'Novo Filme';
  document.getElementById('filmeId').value = '';
  document.getElementById('filmeTitulo').value = '';
  document.getElementById('filmeDescricao').value = '';
  document.getElementById('filmeTrailer').value = '';
  document.getElementById('filmeDuracao').value = '';
  document.getElementById('filmeData').value = '';
  document.getElementById('filmeCapa').value = '';
  document.getElementById('listaGeneros').innerHTML = '';

  await carregarCheckboxGeneros([]);

  filmeModal = new bootstrap.Modal(document.getElementById('modalFilme'));
  filmeModal.show();
}

async function carregarCheckboxGeneros(selecionados = []) {
  const res = await fetch(API_URL+'?request=generos');
  const data = await res.json();
  const lista = document.getElementById('listaGeneros');
  lista.innerHTML = '';

  if (data.success) {
    data.data.forEach(g => {
      const checked = selecionados.includes(g.id) ? 'checked' : '';
      lista.innerHTML += `
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="${g.id}" id="g${g.id}" ${checked}>
          <label class="form-check-label" for="g${g.id}">${g.nome}</label>
        </div>
      `;
    });
  }
}

function editarFilme(filme) {
  document.getElementById('tituloModalFilme').innerText = 'Editar Filme';
  document.getElementById('filmeId').value = filme.id;
  document.getElementById('filmeTitulo').value = filme.titulo;
  document.getElementById('filmeDescricao').value = filme.descricao;
  document.getElementById('filmeTrailer').value = filme.link_trailer;
  document.getElementById('filmeDuracao').value = filme.duracao;
  document.getElementById('filmeData').value = filme.data_lancamento;
  document.getElementById('filmeCapa').value = filme.capa;

  const idsSelecionados = filme.generos.map(g => g.id);
  carregarCheckboxGeneros(idsSelecionados).then(() => {
    filmeModal = new bootstrap.Modal(document.getElementById('modalFilme'));
    filmeModal.show();
  });
}

async function salvarFilme() {
  const id = document.getElementById('filmeId').value;
  const titulo = document.getElementById('filmeTitulo').value.trim();
  const descricao = document.getElementById('filmeDescricao').value.trim();
  const link_trailer = document.getElementById('filmeTrailer').value.trim();
  const duracao = parseInt(document.getElementById('filmeDuracao').value);
  const data_lancamento = document.getElementById('filmeData').value;
  const capa = document.getElementById('filmeCapa').value.trim();

  const generos = Array.from(document.querySelectorAll('#listaGeneros input:checked')).map(input => parseInt(input.value));

  const dados = { titulo, descricao, link_trailer, duracao, data_lancamento, capa, generos };

  const metodo = id ? 'PUT' : 'POST';
  const url = `${API_URL}?request=filmes${id ? '&id=' + id : ''}`;

  const res = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });

  const result = await res.json();
  console.log(result)
  if (result.success) {
    filmeModal.hide();
    buscarFilmes();
  } else {
    alert(result.message || 'Erro ao salvar filme');
  }
}

async function excluirFilme(id) {
  if (!confirm('Deseja realmente excluir este filme?')) return;

  const res = await fetch(`${API_URL}?request=filmes&id=${id}`, {
    method: 'DELETE'
  });

  const data = await res.json();
  if (data.success) {
    buscarFilmes();
  } else {
    alert(data.message || 'Erro ao excluir filme');
  }
}

  
  function carregarGerenciadorGeneros() {
    const painel = document.getElementById('painelConteudo');
    painel.innerHTML = `
      <h4>Gerenciar Gêneros</h4>
      <button class="btn btn-success mb-3" onclick="abrirModalGenero()">+ Novo Gênero</button>
      <table class="table table-dark table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody id="tabelaGeneros">
          <tr><td colspan="4">Carregando...</td></tr>
        </tbody>
      </table>
  
      <!-- Modal Gênero -->
      <div class="modal fade" id="modalGenero" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content bg-dark text-white">
            <div class="modal-header">
              <h5 class="modal-title" id="tituloModalGenero">Novo Gênero</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <input type="hidden" id="generoId">
              <div class="mb-3">
                <label>Nome</label>
                <input type="text" class="form-control" id="generoNome">
              </div>
              <div class="mb-3">
                <label>Descrição</label>
                <textarea class="form-control" id="generoDescricao"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button class="btn btn-primary" onclick="salvarGenero()">Salvar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  
    buscarGeneros();
  }

  async function buscarGeneros() {
    const res = await fetch('http://localhost/cinetech/api/?request=generos');
    const data = await res.json();
  
    const tabela = document.getElementById('tabelaGeneros');
    tabela.innerHTML = '';
  
    if (data.success) {
      data.data.forEach(g => {
        tabela.innerHTML += `
          <tr>
            <td>${g.id}</td>
            <td>${g.nome}</td>
            <td>${g.descricao}</td>
            <td>
              <button class="btn btn-sm btn-warning me-1" onclick='editarGenero(${JSON.stringify(g)})'>
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="btn btn-sm btn-danger" onclick="excluirGenero(${g.id})">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        `;
      });
    } else {
      tabela.innerHTML = `<tr><td colspan="4">Erro ao carregar gêneros.</td></tr>`;
    }
  }
  
  function abrirModalGenero() {
    document.getElementById('tituloModalGenero').innerText = 'Novo Gênero';
    document.getElementById('generoId').value = '';
    document.getElementById('generoNome').value = '';
    document.getElementById('generoDescricao').value = '';
    generoModal = new bootstrap.Modal(document.getElementById('modalGenero'));
    generoModal.show();
  }
  
  function editarGenero(genero) {
    document.getElementById('tituloModalGenero').innerText = 'Editar Gênero';
    document.getElementById('generoId').value = genero.id;
    document.getElementById('generoNome').value = genero.nome;
    document.getElementById('generoDescricao').value = genero.descricao;
    generoModal = new bootstrap.Modal(document.getElementById('modalGenero'));
    generoModal.show();
  }
  
  async function salvarGenero() {
    const id = document.getElementById('generoId').value;
    const nome = document.getElementById('generoNome').value.trim();
    const descricao = document.getElementById('generoDescricao').value.trim();
  
    if (!nome) {
      alert('Nome é obrigatório');
      return;
    }
  
    const metodo = id ? 'PUT' : 'POST';
    const url = `http://localhost/cinetech/api/?request=generos${id ? '&id=' + id : ''}`;
  
    const res = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, descricao })
    });
  
    const data = await res.json();
    if (data.success) {
      generoModal.hide();
      buscarGeneros();
    } else {
      alert(data.message || 'Erro ao salvar gênero');
    }
  }
  
  async function excluirGenero(id) {
    if (!confirm('Tem certeza que deseja excluir este gênero?')) return;
  
    const res = await fetch(`http://localhost/cinetech/api/?request=generos&id=${id}`, {
      method: 'DELETE'
    });
  
    const data = await res.json();
    if (data.success) {
      buscarGeneros();
    } else {
      alert(data.message || 'Erro ao excluir');
    }
  }
    
  
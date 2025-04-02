const API_URL = 'http://localhost/cinetech/api/';

document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  console.log(usuario)
  if (!usuario || usuario.is_admin == 0) {
    alert('Acesso restrito!');
    window.location.href = '../home.html';
    return;
  }
  MostrarInicio();
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
          MostrarInicio();
          break;
        case 'filmes':
          carregarGerenciadorFilmes();
          break;
        case 'generos':
          carregarGerenciadorGeneros();
          break;
        case 'usuarios':
          carregarGerenciadorUsuarios();
          break;
        case 'sair':
          window.location.href = '../home.html';
          break;
      }
    });
  });
});

function MostrarInicio() {
  const painel = document.getElementById('painelConteudo');
  painel.innerHTML = `
  <h4>Estatísticas Gerais</h4>
  <div class="row" id="estatisticasContainer">
    <div class="col-md-4">
      <div class="card text-bg-dark mb-3">
        <div class="card-body text-center">
          <h5 class="card-title">Filmes Cadastrados</h5>
          <p class="display-5" id="estatFilmes">...</p>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card text-bg-dark mb-3">
        <div class="card-body text-center">
          <h5 class="card-title">Categorias</h5>
          <p class="display-5" id="estatGeneros">...</p>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card text-bg-dark mb-3">
        <div class="card-body text-center">
          <h5 class="card-title">Usuários</h5>
          <p class="display-5" id="estatUsuarios">...</p>
        </div>
      </div>
    </div>
  </div>`;

  carregarEstatisticas();
}

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

                  <label class="form-label">Capa do Filme</label>
                  <input type="file" class="form-control mb-2" id="filmeCapaFile">
                  <img id="previewCapa" src="" class="mt-2 rounded" style="max-width: 150px;">
                  
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
  const res = await fetch(API_URL + '?request=filmes');
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
  document.getElementById('filmeCapaFile').value = '';
  document.getElementById('listaGeneros').innerHTML = '';

  document.getElementById('filmeCapaFile').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('previewCapa').src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  await carregarCheckboxGeneros([]);

  filmeModal = new bootstrap.Modal(document.getElementById('modalFilme'));
  filmeModal.show();
}

async function carregarCheckboxGeneros(selecionados = []) {
  const res = await fetch(API_URL + '?request=generos');
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
  document.getElementById('previewCapa').src = '../../' + filme.capa;

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

  const generos = Array.from(document.querySelectorAll('#listaGeneros input:checked')).map(input => parseInt(input.value));

  const capaInput = document.getElementById('filmeCapaFile');
  let capaPath = '';

  if (capaInput.files.length > 0) {
    const formData = new FormData();
    formData.append('imagem', capaInput.files[0]);

    const uploadRes = await fetch('http://localhost/cinetech/api/upload.php', {
      method: 'POST',
      body: formData
    });

    const uploadData = await uploadRes.json();
    if (!uploadData.success) {
      alert('Erro ao enviar imagem');
      return;
    }
    capaPath = uploadData.arquivo;
  } else {
    capaPath = document.getElementById('filmeCapa').value || '';
  }

  const dados = { titulo, descricao, link_trailer, duracao, data_lancamento, capa: capaPath, generos };

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

async function carregarEstatisticas() {
  const res = await fetch('http://localhost/cinetech/api/?request=estatisticas');
  const result = await res.json();
  console.log(result)
  if (result.success) {
    document.getElementById('estatFilmes').innerText = result.data.filmes;
    document.getElementById('estatGeneros').innerText = result.data.generos;
    document.getElementById('estatUsuarios').innerText = result.data.usuarios;
  } else {
    document.getElementById('estatFilmes').innerText = '-';
    document.getElementById('estatGeneros').innerText = '-';
    document.getElementById('estatUsuarios').innerText = '-';
  }
}

function carregarGerenciadorUsuarios() {
  const painel = document.getElementById('painelConteudo');
  painel.innerHTML = `
    <h4>Gerenciar Usuários</h4>
    <button class="btn btn-success mb-3" onclick="abrirModalUsuario()">+ Novo Usuário</button>
    <table class="table table-dark table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Email</th>
          <th>Admin</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody id="tabelaUsuarios">
        <tr><td colspan="5">Carregando...</td></tr>
      </tbody>
    </table>

    <!-- Modal Usuário -->
    <div class="modal fade" id="modalUsuario" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content bg-dark text-white">
          <div class="modal-header">
            <h5 class="modal-title" id="tituloModalUsuario">Novo Usuário</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <input type="hidden" id="usuarioId">
            <div class="mb-2">
              <label>Nome</label>
              <input type="text" class="form-control" id="usuarioNome">
            </div>
            <div class="mb-2">
              <label>Email</label>
              <input type="email" class="form-control" id="usuarioEmail">
            </div>
            <div class="mb-2">
              <label>Senha</label>
              <input type="password" class="form-control" id="usuarioSenha" placeholder="••••••">
              <small class="text-muted">Deixe em branco para manter a senha atual.</small>
            </div>
            <div class="form-check mt-2">
              <input class="form-check-input" type="checkbox" id="usuarioAdmin">
              <label class="form-check-label" for="usuarioAdmin">Administrador</label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-primary" onclick="salvarUsuario()">Salvar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  buscarUsuarios();
}

let usuarioModal;

async function buscarUsuarios() {
  const res = await fetch('http://localhost/cinetech/api/?request=usuarios&acao=listar');
  const result = await res.json();
  const tabela = document.getElementById('tabelaUsuarios');
  tabela.innerHTML = '';

  if (result.success) {
    result.data.forEach(u => {
      tabela.innerHTML += `
        <tr>
          <td>${u.id}</td>
          <td>${u.nome}</td>
          <td>${u.email}</td>
          <td>${u.is_admin == 1 ? 'Sim' : 'Não'}</td>
          <td>
            <button class="btn btn-sm btn-warning me-1" onclick='editarUsuario(${JSON.stringify(u)})'>
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="excluirUsuario(${u.id})">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });
  } else {
    tabela.innerHTML = '<tr><td colspan="5">Erro ao carregar usuários</td></tr>';
  }
}

function abrirModalUsuario() {
  document.getElementById('tituloModalUsuario').innerText = 'Novo Usuário';
  document.getElementById('usuarioId').value = '';
  document.getElementById('usuarioNome').value = '';
  document.getElementById('usuarioEmail').value = '';
  document.getElementById('usuarioSenha').value = '';
  document.getElementById('usuarioAdmin').checked = false;

  usuarioModal = new bootstrap.Modal(document.getElementById('modalUsuario'));
  usuarioModal.show();
}

function editarUsuario(usuario) {
  document.getElementById('tituloModalUsuario').innerText = 'Editar Usuário';
  document.getElementById('usuarioId').value = usuario.id;
  document.getElementById('usuarioNome').value = usuario.nome;
  document.getElementById('usuarioEmail').value = usuario.email;
  document.getElementById('usuarioSenha').value = '';
  document.getElementById('usuarioAdmin').checked = usuario.is_admin == 1;

  usuarioModal = new bootstrap.Modal(document.getElementById('modalUsuario'));
  usuarioModal.show();
}

async function salvarUsuario() {
  const id = document.getElementById('usuarioId').value;
  const nome = document.getElementById('usuarioNome').value.trim();
  const email = document.getElementById('usuarioEmail').value.trim();
  const senha = document.getElementById('usuarioSenha').value.trim();
  const is_admin = document.getElementById('usuarioAdmin').checked ? 1 : 0;

  if (!nome || !email) {
    alert('Nome e email são obrigatórios.');
    return;
  }

  const dados = { nome, email, is_admin };
  if (senha) dados.senha = senha;

  const metodo = id ? 'PUT' : 'POST';
  const url = `http://localhost/cinetech/api/?request=usuarios${id ? '&id=' + id : ''}`;

  const res = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });

  const result = await res.json();
  if (result.success) {
    usuarioModal.hide();
    buscarUsuarios();
  } else {
    alert(result.message || 'Erro ao salvar usuário.');
  }
}

async function excluirUsuario(id) {
  if (!confirm('Deseja mesmo excluir este usuário?')) return;

  const res = await fetch(`http://localhost/cinetech/api/?request=usuarios&id=${id}`, {
    method: 'DELETE'
  });

  const result = await res.json();
  if (result.success) {
    buscarUsuarios();
  } else {
    alert(result.message || 'Erro ao excluir usuário.');
  }
}

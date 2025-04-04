let todosFilmes = []; // variável global com todos os filmes
let Tema;

document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario) {
    alert('Você precisa estar logado')
    document.hidden = true
    window.location.href = '/pages/login.html';
  }
  if (usuario.is_admin == 0) {
    document.getElementById('adminLink').style.display = 'none';
  }

  let profileImage = document.getElementById('iconePerfil');
  let previewProfile = document.getElementById('previewPerfil');

  let ImageProfile = usuario.imagem_perfil ? `../../${usuario.imagem_perfil}` : '../../assets/imagens/default_profile.png';

  previewProfile.src = ImageProfile;
  profileImage.src = ImageProfile

  // carregar tema nos cookie
  Tema = document.cookie.replace(/(?:(?:^|.*;\s*)tema\s*\=\s*([^;]*).*$)|^.*$/, '$1');
  if (Tema) {
    aplicarTema(Tema);
  }

  console.log(usuario)

  carregarFilmesPorGenero();
  carregarGenerosParaFiltro();
  const formBusca = document.getElementById('formBusca');

  let filterGenero = document.getElementById('filtroGeneroContainer');

  formBusca.addEventListener('submit', e => {
    e.preventDefault();
    const termo = document.getElementById('campoBusca').value.trim().toLowerCase();
    buscarFilmes(termo);
  });

  document.getElementById('filtroGenero').addEventListener('change', e => {
    const generoSelecionado = e.target.value;
    carregarFilmesPorGenero(generoSelecionado);
  });

});

async function carregarFilmesPorGenero(filtroGenero = 'todos') {
  
  try {
    const res = await fetch('http://localhost/cinetech/api/?request=filmes');
    const resultado = await res.json();

    if (!resultado.success) {
      mostrarToast('Erro ao carregar filmes.');
      return;
    }

    const filmes = resultado.data;
    const container = document.querySelector('#generos-container');
    container.innerHTML = '';

    // Agrupar por gênero
    const generosMap = {};
    todosFilmes = filmes;
    filmes.forEach(filme => {
      filme.generos.forEach(genero => {
        if (!generosMap[genero.nome]) {
          generosMap[genero.nome] = [];
        }
        generosMap[genero.nome].push(filme);
      });
    });

    // Criar carrossel para cada gênero
    for (const genero in generosMap) {
     if (filtroGenero !== 'todos' && genero !== filtroGenero) continue;
     console.log(genero, filtroGenero)
      const filmesDoGenero = generosMap[genero];

      const bloco = document.createElement('div');
      bloco.classList.add('mb-4');
      bloco.innerHTML = `
        <h4 class="mb-3 text-light">${genero}</h4>
        <div class="carousel-filmes">
          ${filmesDoGenero.map(filme => `
            <div class="card card-filme bg-dark text-white">
              <img src="../../${filme.capa}" class="card-img-top" alt="${filme.titulo}">
              <div class="card-body">
                <h6 class="card-title " style="width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${filme.titulo}</h6>
                <a href="#" class="btn btn-primary btn-sm mb-2" onclick="abrirTrailer('${filme.link_trailer}', '${filme.descricao}', '${filme.titulo}', '${filme.duracao}')">
                  <i class="bi bi-play-circle"></i> Informações
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      container.appendChild(bloco);
    }

  } catch (error) {
    console.error(error);
    mostrarToast('Erro ao conectar com o servidor.');
  }
}

function mostrarToast(mensagem, tipo = 'danger') {
  const toastHTML = `
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 5;">
      <div id="liveToast" class="toast align-items-center text-bg-${tipo} border-0" role="alert">
        <div class="d-flex">
          <div class="toast-body">${mensagem}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', toastHTML);
  const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById('liveToast'));
  toast.show();

  document.getElementById('liveToast').addEventListener('hidden.bs.toast', () => {
    document.querySelector('.position-fixed.bottom-0.end-0')?.remove();
  });
}

function buscarFilmes(termo) {
  if (!termo) {
    carregarFilmesPorGenero(); // restaura visualização completa
    return;
  }

  const filtrados = todosFilmes.filter(filme =>
    filme.titulo.toLowerCase().includes(termo)
  );

  const container = document.querySelector('#generos-container');
  container.innerHTML = '<h4>Resultados da busca</h4>';

  if (filtrados.length === 0) {
    container.innerHTML += '<p class="text-muted">Nenhum filme encontrado.</p>';
    return;
  }

  const bloco = document.createElement('div');
  bloco.classList.add('carousel-filmes');

  filtrados.forEach(filme => {

    bloco.innerHTML += `
      <div class="card card-filme card-filme bg-dark text-white">
        <img src="../../${filme.capa}" class="card-img-top" alt="${filme.titulo}">
        
        <div class="card-body">
          <h6 class="card-title">${filme.titulo}</h6>
          <a href="${filme.link_trailer}" target="_blank" class="btn btn-primary btn-sm">
            <i class="bi bi-play-circle"></i> Informações
          </a>
        </div>
      </div>`;
  });

  container.appendChild(bloco);
}

function abrirTrailer(link, descricao, nome, duracao) {
  const modal = new bootstrap.Modal(document.getElementById('modalTrailer'));
  const descricaoFilme = document.getElementById('descricaoFilme');
  const nomeFilme = document.getElementById('tituloModalTrailer');
  const duracaoFilme = document.getElementById('duracaoFilme');
  const iframe = document.getElementById('iframeTrailer');
  
  // Converter para embed (se for YouTube)
  const embedLink = transformarParaEmbed(link);
  iframe.src = embedLink;

  descricaoFilme.innerText = descricao;
  nomeFilme.innerText = nome;
  duracaoFilme.innerText = duracao+' minutos';

  modal.show();

  // Limpa o vídeo quando fechar o modal
  document.getElementById('modalTrailer').addEventListener('hidden.bs.modal', () => {
    iframe.src = '';
  }, { once: true });
}

async function carregarGenerosParaFiltro() {
  const res = await fetch('http://localhost/cinetech/api/?request=generos');
  const result = await res.json();

  if (result.success) {
    const select = document.getElementById('filtroGenero');
    result.data.forEach(genero => {
      const option = document.createElement('option');
      option.value = genero.nome;
      option.textContent = genero.nome;
      select.appendChild(option);
    });
  }
}

function transformarParaEmbed(url) {
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url; // fallback: retorna original se não for YouTube
}

// CONFIGURAÇÃO DO MODAL
document.getElementById('imagemPerfilInput').addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('previewPerfil').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

function atualizarImagemTopo() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const img = document.getElementById('iconePerfil');
  img.src = usuario.imagem_perfil ? `../../${usuario.imagem_perfil}` : '../../assets/imagens/default_profile.png';
}

document.getElementById('salvarConfig').addEventListener('click', async () => {
  const novaSenha = document.getElementById('novaSenha').value.trim();
  const tema = document.getElementById('temaSelect').value;
  const imagemInput = document.getElementById('imagemPerfilInput');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  let imagem_perfil = usuario.imagem_perfil;

  // Upload da imagem, se houver
  if (imagemInput.files.length > 0) {
    const formData = new FormData();
    formData.append('imagem', imagemInput.files[0]);

    const uploadRes = await fetch('http://localhost/cinetech/api/upload.php', {
      method: 'POST',
      body: formData
    });

    const uploadData = await uploadRes.json();
    if (!uploadData.success) {
      mostrarToast('Erro ao enviar imagem de perfil', 'danger');
      return;
    }
    imagem_perfil = uploadData.arquivo;
  }

  // Construir o objeto para atualização
  const dadosAtualizados = { imagem_perfil };

  if (novaSenha !== '') {
    dadosAtualizados.senha = novaSenha;
  }

  // Atualizar no banco
  const res = await fetch(`http://localhost/cinetech/api/?request=usuarios&id=${usuario.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dadosAtualizados)
  });

  const result = await res.json();

  if (result.success) {
    // Atualiza imagem e tema localmente
    usuario.imagem_perfil = imagem_perfil;
    localStorage.setItem('usuario', JSON.stringify(usuario));
    atualizarImagemTopo();

    // Armazenar o tema - Cookies
    Tema = tema;
    document.cookie = `tema=${tema}; expires=${new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
    aplicarTema(tema);
    window.location.reload();

    mostrarToast('Configurações salvas com sucesso!', 'success');
  } else {
    mostrarToast('Erro ao salvar configurações.', 'danger');
  }
});

function aplicarTema(tema) {
  const body = document.body;
  body.classList.toggle('bg-light', tema === 'light');
  body.classList.toggle('bg-dark', tema === 'dark');
  body.style.color = tema === 'light' ? '#000' : '#fff';

  const cards = document.querySelectorAll('.card-filme');
  cards.forEach(card => {
    card.classList.toggle('bg-gray', tema === 'light'); // Altera a cor de fundo
    card.classList.toggle('dark:bg-gray', tema === 'dark'); // Altera a cor de fundo
    card.style.color = tema === 'light' ? '#000' : '#fff'; // Altera a cor do texto
  });
}

document.getElementById('btnLogout').addEventListener('click', () => {
  localStorage.removeItem('usuario');
  window.location.href = 'login.html';
});
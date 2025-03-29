let todosFilmes = []; // variável global com todos os filmes

document.addEventListener('DOMContentLoaded', () => {
  carregarFilmesPorGenero();

  const formBusca = document.getElementById('formBusca');
  formBusca.addEventListener('submit', e => {
    e.preventDefault();
    const termo = document.getElementById('campoBusca').value.trim().toLowerCase();
    buscarFilmes(termo);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  carregarFilmesPorGenero();
});

async function carregarFilmesPorGenero() {
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
      const filmesDoGenero = generosMap[genero];

      const bloco = document.createElement('div');
      bloco.classList.add('mb-4');

      bloco.innerHTML = `
        <h4>${genero}</h4>
        <div class="carousel-filmes">
          ${filmesDoGenero.map(filme => `
            <div class="card card-filme bg-dark text-white">
              <img src="../${filme.capa}" class="card-img-top" alt="${filme.titulo}">
              <div class="card-body">
                <h6 class="card-title">${filme.titulo}</h6>
                <a href="${filme.link_trailer}" target="_blank" class="btn btn-primary btn-sm">
                  <i class="bi bi-play-circle"></i> Trailer
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

function mostrarToast(mensagem) {
  const toastHTML = `
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 5;">
      <div id="liveToast" class="toast align-items-center text-bg-danger border-0" role="alert">
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
      <div class="card card-filme bg-dark text-white">
        <img src="../${filme.capa}" class="card-img-top" alt="${filme.titulo}">
        <div class="card-body">
          <h6 class="card-title">${filme.titulo}</h6>
          <a href="${filme.link_trailer}" target="_blank" class="btn btn-primary btn-sm">
            <i class="bi bi-play-circle"></i> Trailer
          </a>
        </div>
      </div>`;
  });

  container.appendChild(bloco);
}
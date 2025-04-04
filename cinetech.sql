-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 04/04/2025 às 02:24
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `cinetech`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `filmes`
--

CREATE TABLE `filmes` (
  `id` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `descricao` text DEFAULT NULL,
  `capa` varchar(255) DEFAULT NULL,
  `link_trailer` varchar(255) DEFAULT NULL,
  `data_lancamento` date DEFAULT NULL,
  `duracao` int(11) DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `filmes`
--

INSERT INTO `filmes` (`id`, `titulo`, `descricao`, `capa`, `link_trailer`, `data_lancamento`, `duracao`, `criado_em`) VALUES
(2, 'Matrix', 'Um programador descobre que sua realidade não é o que ele pensa de verdade..', 'uploads/67eda92ff410f.jpg', 'https://www.youtube.com/watch?v=m8e-FF8MsqU', '1999-03-31', 136, '2025-03-26 23:46:24'),
(4, 'Matrix', 'Um programador descobre a realidade...', 'uploads/matrix.jpg', 'https://www.youtube.com/watch?v=m8e-FF8MsqU', '1999-03-31', 136, '2025-04-03 23:21:23'),
(6, 'Homem-Aranha: Sem Volta para Casa', 'Em Homem-Aranha: Sem Volta para Casa, Peter Parker (Tom Holland) precisará lidar com as consequências da sua identidade como o herói mais querido do mundo após ter sido revelada pela reportagem do Clarim Diário, com uma gravação feita por Mysterio (Jake Gyllenhaal) no filme anterior. Incapaz de separar sua vida normal das aventuras de ser um super-herói, além de ter sua reputação arruinada por acharem que foi ele quem matou Mysterio e pondo em risco seus entes mais queridos, Parker pede ao Doutor Estranho (Benedict Cumberbatch) para que todos esqueçam sua verdadeira identidade', 'uploads/67ef1aeaee094.jpg', 'https://www.youtube.com/watch?v=CyiiEJRZjSU', '2025-03-30', 112, '2025-04-03 23:34:02'),
(7, 'Pixels', 'A humanidade sempre buscou vida fora da Terra e, em busca de algum contato, enviou imagens e sons variados sobre a cultura terrestre nos mais diversos satélites já lançados no universo. Um dia, um deles foi encontrado. Disposta a conquistar o planeta, a raça alienígena resolveu criar monstros digitais inspirados em videogame', 'uploads/67ef25d873c29.jpg', 'https://www.youtube.com/watch?v=CyiiEJRZjSU', '2025-02-24', 112, '2025-04-04 00:20:40');

-- --------------------------------------------------------

--
-- Estrutura para tabela `filmes_generos`
--

CREATE TABLE `filmes_generos` (
  `filme_id` int(11) NOT NULL,
  `genero_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `filmes_generos`
--

INSERT INTO `filmes_generos` (`filme_id`, `genero_id`) VALUES
(2, 1),
(2, 2),
(4, 1),
(4, 2),
(6, 1),
(6, 2),
(7, 2);

-- --------------------------------------------------------

--
-- Estrutura para tabela `generos`
--

CREATE TABLE `generos` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `generos`
--

INSERT INTO `generos` (`id`, `nome`, `descricao`) VALUES
(1, 'Ação', 'Filmes com muita ação para animar.'),
(2, 'Aventura', 'Filmes para embarcar em aventuras emocionantes.'),
(3, 'Terror', 'Filmes para arrupiar o cabelo da cabeça de medo.'),
(4, 'Suspense', 'Filmes para morder as unhas e palpitar o coração.'),
(5, 'Anime', 'Desenho Japones');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `imagem_perfil` varchar(255) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `imagem_perfil`, `is_admin`, `criado_em`) VALUES
(10, 'User', 'teste@example.com', '$2y$10$hR3uMTjxraJULbin5OHB1uEoA1NpsD2kBY1wLachfMjn8P16uUqbi', '', 0, '2025-04-02 18:18:59'),
(11, 'User 2', 'teste2@example.com', '$2y$10$GCEC7GTicjFwr4ixHKSO7uTmFh1X8tmozrhnVlgpCBVHEaex3VdUi', '', 0, '2025-04-02 18:19:22'),
(13, 'admin', 'admin@teste.com', '$2y$10$KQA0Pu2sVHsBgwoU2D7GTe5pXNRx8oVSqoycPtSkoemOCNrHk5WG.', 'uploads/67ef1ca188bcb.png', 1, '2025-04-02 20:54:57');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `filmes`
--
ALTER TABLE `filmes`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `filmes_generos`
--
ALTER TABLE `filmes_generos`
  ADD PRIMARY KEY (`filme_id`,`genero_id`),
  ADD KEY `genero_id` (`genero_id`);

--
-- Índices de tabela `generos`
--
ALTER TABLE `generos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `filmes`
--
ALTER TABLE `filmes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `generos`
--
ALTER TABLE `generos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `filmes_generos`
--
ALTER TABLE `filmes_generos`
  ADD CONSTRAINT `filmes_generos_ibfk_1` FOREIGN KEY (`filme_id`) REFERENCES `filmes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `filmes_generos_ibfk_2` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

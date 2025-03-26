CREATE DATABASE filmes_db DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE cinetech;

-- Tabela Usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    imagem_perfil VARCHAR(255) DEFAULT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Generos
CREATE TABLE generos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT
);

-- Tabela Filmes
CREATE TABLE filmes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    capa VARCHAR(255),
    link_trailer VARCHAR(255),
    data_lancamento DATE,
    duracao INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Associativa (Muitos-para-Muitos) Filmes e Generos
CREATE TABLE filmes_generos (
    filme_id INT,
    genero_id INT,
    PRIMARY KEY (filme_id, genero_id),
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE,
    FOREIGN KEY (genero_id) REFERENCES generos(id) ON DELETE CASCADE
);

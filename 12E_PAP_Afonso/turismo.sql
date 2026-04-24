

SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT;
SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS;
SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `avaliacao`;
CREATE TABLE IF NOT EXISTS `avaliacao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nota` int DEFAULT NULL,
  `comentario` text,
  `utilizador_id` int NOT NULL,
  `local_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `utilizador_id` (`utilizador_id`,`local_id`),
  KEY `local_id` (`local_id`)
) ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `categoria`
--

DROP TABLE IF EXISTS `categoria`;
CREATE TABLE IF NOT EXISTS `categoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `favorito`
--

DROP TABLE IF EXISTS `favorito`;
CREATE TABLE IF NOT EXISTS `favorito` (
  `id` int NOT NULL AUTO_INCREMENT,
  `utilizador_id` int NOT NULL,
  `local_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `utilizador_id` (`utilizador_id`,`local_id`),
  KEY `local_id` (`local_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `local`
--

DROP TABLE IF EXISTS `local`;
CREATE TABLE IF NOT EXISTS `local` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `descricao` text,
  `distrito` varchar(100) DEFAULT NULL,
  `categoria_id` int NOT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `icone` varchar(20) DEFAULT NULL,
  `subtitulo` varchar(150) DEFAULT NULL,
  `preco` varchar(50) DEFAULT NULL,
  `extras_json` text,
  `pos_x` int DEFAULT NULL,
  `pos_y` int DEFAULT NULL,
  `mostrar_slider` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `categoria_id` (`categoria_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `conteudo`
--

DROP TABLE IF EXISTS `conteudo`;
CREATE TABLE IF NOT EXISTS `conteudo` (
  `chave` varchar(80) NOT NULL,
  `valor` text,
  PRIMARY KEY (`chave`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `utilizador`
--

DROP TABLE IF EXISTS `utilizador`;
CREATE TABLE IF NOT EXISTS `utilizador` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `avaliacao`
--
ALTER TABLE `avaliacao`
  ADD CONSTRAINT `avaliacao_ibfk_1` FOREIGN KEY (`utilizador_id`) REFERENCES `utilizador` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `avaliacao_ibfk_2` FOREIGN KEY (`local_id`) REFERENCES `local` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `favorito`
--
ALTER TABLE `favorito`
  ADD CONSTRAINT `favorito_ibfk_1` FOREIGN KEY (`utilizador_id`) REFERENCES `utilizador` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorito_ibfk_2` FOREIGN KEY (`local_id`) REFERENCES `local` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `local`
--
ALTER TABLE `local`
  ADD CONSTRAINT `local_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`id`) ON DELETE CASCADE;
COMMIT;

SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;

--
-- Seeds (conteúdo base)
--

INSERT INTO `categoria` (`id`, `nome`) VALUES
(1, 'Pontos Turísticos'),
(2, 'Hotéis'),
(3, 'Natureza'),
(4, 'Cultura')
ON DUPLICATE KEY UPDATE `nome`=VALUES(`nome`);

INSERT INTO `conteudo` (`chave`, `valor`) VALUES
('hero_title', 'Descubra São Tomé e Príncipe'),
('hero_subtitle', 'Um paraíso tropical no coração do Atlântico'),
('historia_title', 'Um Pouco da História'),
('historia_p1', 'São Tomé e Príncipe é um pequeno país insular localizado no Golfo da Guiné, na costa da África Central. Descoberto por navegadores portugueses no século XV, tornou-se uma importante colónia para a produção de açúcar, cacau e café.'),
('historia_p2', 'A independência foi conquistada em 12 de julho de 1975, marcando o início de uma nova era para o país. Hoje, São Tomé e Príncipe é conhecido pela sua biodiversidade única, praias paradisíacas e cultura vibrante.'),
('footer_title', 'Turismo São Tomé e Príncipe'),
('footer_subtitle', 'Descubra o paraíso tropical no coração do Atlântico'),
('footer_email', 'info@turismostp.com'),
('footer_phone', '+239 222 1234')
ON DUPLICATE KEY UPDATE `valor`=VALUES(`valor`);

INSERT INTO `local` (`id`, `nome`, `descricao`, `distrito`, `categoria_id`, `imagem`, `icone`, `subtitulo`, `preco`, `extras_json`, `pos_x`, `pos_y`, `mostrar_slider`) VALUES
(1, 'Praia Jalé', 'A Praia Jalé é uma famosa praia tropical agradável e isolada, conhecida principalmente como um santuário para a desova de tartarugas marinhas.', 'São Tomé', 1, 'imagens/praia.jpg', '🏖️', 'Santuário de Tartarugas', NULL, '["Areia dourada","Águas cristalinas"]', 45, 70, 1),
(2, 'Pico Cão Grande', 'Formação vulcânica icónica em forma de agulha no Parque Natural Ôbo. Um dos maiores ícones do país.', 'São Tomé', 1, 'imagens/pico.jpg', '⛰️', 'Formação Vulcânica Icónica', NULL, '["Trilhos","Paisagens"]', 50, 35, 1),
(3, 'Roça São João', 'Herança colonial transformada em experiência cultural e gastronómica.', 'São Tomé', 4, 'imagens/roça.jpg', '🏛️', 'Herança Colonial', NULL, '["Cultura","Gastronomia"]', 60, 55, 0),
(4, 'Lagoa Azul', 'Piscina natural de águas cristalinas e azul-turquesa, ideal para mergulho e snorkeling.', 'São Tomé', 3, 'imagens/lagoa.jpg', '💧', 'Águas Cristalinas', NULL, '["Snorkeling","Mergulho"]', 30, 45, 0),
(5, 'Boca do Inferno', 'Penhasco dramático onde as ondas criam um espetáculo natural impressionante.', 'São Tomé', 3, 'imagens/boca.jpg', '🌊', 'Penhasco Dramático', NULL, '["Miradouro","Fotografia"]', 25, 25, 0),
(6, 'Omali São Tomé', 'Hotel premium com vista para o mar, piscina e restaurante.', 'São Tomé', 2, 'imagens/omali.jpg', '🏨', 'Premium', '214$/noite', '["Wi-Fi","Piscina","Restaurante","Transfer"]', 55, 20, 0),
(7, 'Pestana São Tomé', 'Resort 5 estrelas com piscina, ginásio e spa.', 'São Tomé', 2, 'imagens/pestana.jpg', '⭐', '5 Estrelas', '150$/noite', '["Wi-Fi","Piscina","Restaurante","Ginásio"]', 70, 40, 0),
(8, 'Hotel Praia', 'Boa relação qualidade/preço, com piscina e restaurante.', 'São Tomé', 2, 'imagens/hotelpraia.jpg', '🏨', 'Económico', '80$/noite', '["Wi-Fi","Piscina","Restaurante"]', 40, 60, 0),
(9, 'Club Santana Beach & Resort', 'Resort com praia privada e atividades aquáticas.', 'Santana', 2, 'imagens/clubsantana.jpg', '🌴', 'Resort', '100$/noite', '["Wi-Fi","Piscina","Praia Privada"]', 65, 65, 0)
ON DUPLICATE KEY UPDATE
`nome`=VALUES(`nome`),
`descricao`=VALUES(`descricao`),
`distrito`=VALUES(`distrito`),
`categoria_id`=VALUES(`categoria_id`),
`imagem`=VALUES(`imagem`),
`icone`=VALUES(`icone`),
`subtitulo`=VALUES(`subtitulo`),
`preco`=VALUES(`preco`),
`extras_json`=VALUES(`extras_json`),
`pos_x`=VALUES(`pos_x`),
`pos_y`=VALUES(`pos_y`),
`mostrar_slider`=VALUES(`mostrar_slider`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;



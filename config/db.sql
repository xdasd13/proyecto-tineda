CREATE DATABASE tiendaJuegos;
USE tiendaJuegos;

CREATE TABLE categoria(
    idcategoria  	INT PRIMARY KEY AUTO_INCREMENT,
    nomcategoria	VARCHAR(30)
) ENGINE = INNODB;

CREATE TABLE plataformas(
	idplataforma 	INT PRIMARY KEY AUTO_INCREMENT,
    nomplataforma	VARCHAR(35)
)ENGINE = INNODB;


CREATE TABLE juegos(
    idjuego 			INT PRIMARY KEY AUTO_INCREMENT,
    nomjuego 			VARCHAR(50) NOT NULL,
    precio 				DECIMAL(10,2) NOT NULL,
    clasificacion		ENUM('Todos','Todos +10','Adolescentes','Maduro +17','Adulto') NOT NULL,
    descripcion			TEXT NOT NULL,
    editor				VARCHAR(40) NOT NULL,
    referenciaimg		VARCHAR(250),
    idcategoria         INT,
    idplataforma		INT,
    FOREIGN KEY (idcategoria) REFERENCES categoria(idcategoria),
    FOREIGN KEY (idplataforma)	REFERENCES plataformas(idplataforma)
) ENGINE = INNOD

INSERT INTO categoria (nomcategoria) VALUES
('Sandbox'),
('Estrategia'),
('Shooter'),
('Batalla multijugador'),
('RPG'),
('Simulación y deporte'),
('Puzzles'),
('Acción-aventura'),
('Supervivencia y terror');

INSERT INTO plataformas (nomplataforma) VALUES
('PlayStation'),
('Xbox'),
('Nintendo Switch'),
('Teléfono'),
('Multi-plataforma');

SELECT 
    j.idjuego,
    j.nomjuego,
    j.precio,
    j.clasificacion,
    j.descripcion,
    j.editor,
    j.referenciaimg,
    c.nomcategoria AS categoria,
    p.nomplataforma AS plataforma
FROM juegos j
JOIN categoria c ON j.idcategoria = c.idcategoria
JOIN plataformas p ON j.idplataforma = p.idplataforma;


INSERT INTO juegos (
    nomjuego, precio, clasificacion, descripcion, editor, referenciaimg, idcategoria, idplataforma
) VALUES
('The Legend of Zelda: Breath of the Wild', 59.99, 'Todos +10',
 'Aventura épica en un mundo abierto donde exploras y resuelves acertijos.', 'Nintendo',
 '/img/zelda_botw.jpg', 8, 3),

('FIFA 24', 69.99, 'Todos',
 'Simulador de fútbol con licencias oficiales, equipos y jugadores reales.', 'EA Sports',
 '/img/fifa24.jpg', 6, 5),

('Call of Duty: Modern Warfare III', 69.99, 'Maduro +17',
 'Shooter en primera persona con campaña intensa y multijugador competitivo.', 'Activision',
 '/img/cod_mw3.jpg', 3, 5);
 
SELECT juegos.idjuego, juegos.nomjuego, juegos.precio, juegos.clasificacion, juegos.editor,
       categoria.nomcategoria, plataformas.nomplataforma
FROM juegos
LEFT JOIN categoria ON juegos.idcategoria = categoria.idcategoria
LEFT JOIN plataformas ON juegos.idplataforma = plataformas.idplataforma;


 SELECT * FROM juegos;
 SELECT * FROM categoria;
SELECT * FROM plataformas;



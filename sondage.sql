-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Client :  127.0.0.1
-- Généré le :  Sam 25 Février 2017 à 14:05
-- Version du serveur :  5.7.14
-- Version de PHP :  5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `projet_info2`
--

-- --------------------------------------------------------

--
-- Structure de la table `module`
--

CREATE TABLE `module` (
  `id` int(11) NOT NULL,
  `intitule_module` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `module`
--

INSERT INTO `module` (`id`, `intitule_module`) VALUES
(1, 'EF1 - Algorithmique Programmation'),
(2, 'EF2 - Bases de données'),
(3, 'EF3 - Modélisation'),
(4, 'EF4 - Système et réseaux'),
(5, 'WEB INFO2 - Pages Web Dynamiques'),
(6, 'WEB MI3 - Développement Web en PHP'),
(7, 'Web MI4 - Développement Web en Java');

-- --------------------------------------------------------

--
-- Structure de la table `module_niveau`
--

CREATE TABLE `module_niveau` (
  `moduleId` int(11) NOT NULL,
  `niveauId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `module_niveau`
--

INSERT INTO `module_niveau` (`moduleId`, `niveauId`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(3, 1),
(3, 2),
(3, 3),
(3, 4),
(4, 1),
(4, 2),
(4, 3),
(4, 4),
(5, 1),
(6, 1),
(7, 1);

-- --------------------------------------------------------

--
-- Structure de la table `niveau`
--

CREATE TABLE `niveau` (
  `id` int(11) NOT NULL,
  `intitule_niveau` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `niveau`
--

INSERT INTO `niveau` (`id`, `intitule_niveau`) VALUES
(1, 'MI-AW'),
(2, 'MI-ASSR'),
(3, 'MI-SIGD SIMO'),
(4, 'MI-SIGD Big Data');

-- --------------------------------------------------------

--
-- Structure de la table `question`
--

CREATE TABLE `question` (
  `id` int(11) NOT NULL,
  `moduleId` int(11) NOT NULL,
  `intitule_question` varchar(255) NOT NULL,
  `intitule_reponse1` varchar(255) NOT NULL,
  `intitule_reponse2` varchar(255) NOT NULL,
  `intitule_reponse3` varchar(255) NOT NULL,
  `multiple` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `question`
--

INSERT INTO `question` (`id`, `moduleId`, `intitule_question`, `intitule_reponse1`, `intitule_reponse2`, `intitule_reponse3`, `multiple`) VALUES
(1, 1, 'intitule question 1 module EF1', 'intitule reponse 1 question 1 module EF1', 'intitule reponse 2 question 1 module EF1', 'intitule reponse 3 question 1 module EF1', 1),
(2, 1, 'intitule question 2 module EF1', 'intitule reponse 1 question 2 module EF1', 'intitule reponse 2 question 2 module EF1', 'intitule reponse 3 question 2 module EF1', 0),
(3, 1, 'intitule question 3 module EF1', 'intitule reponse 1 question 3 module EF1', 'intitule reponse 2 question 3 module EF1', 'intitule reponse 3 question 3 module EF1', 0),
(4, 2, 'intitule question 1 module EF2', 'intitule reponse 1 question 1 module EF2', 'intitule reponse 2 question 1 module EF2', 'intitule reponse 3 question 1 module EF2', 1),
(5, 2, 'intitule question 2 module EF2', 'intitule reponse 1 question 2 module EF2', 'intitule reponse 2 question 2 module EF2', 'intitule reponse 3 question 2 module EF2', 0),
(6, 2, 'intitule question 3 module EF2', 'intitule reponse 1 question 3 module EF2', 'intitule reponse 2 question 3 module EF2', 'intitule reponse 3 question 3 module EF2', 0),
(7, 3, 'intitule question 1 module EF3', 'intitule reponse 1 question 1 module EF3', 'intitule reponse 2 question 1 module EF3', 'intitule reponse 3 question 1 module EF3', 0),
(8, 3, 'intitule question 2 module EF3', 'intitule reponse 1 question 2 module EF3', 'intitule reponse 2 question 2 module EF3', 'intitule reponse 3 question 2 module EF3', 0),
(9, 3, 'intitule question 3 module EF3', 'intitule reponse 1 question 3 module EF3', 'intitule reponse 2 question 3 module EF3', 'intitule reponse 3 question 3 module EF3', 1),
(10, 4, 'intitule question 1 module EF4', 'intitule reponse 1 question 1 module EF4', 'intitule reponse 2 question 1 module EF4', 'intitule reponse 3 question 1 module EF4', 0),
(11, 4, 'intitule question 2 module EF4', 'intitule reponse 1 question 2 module EF4', 'intitule reponse 2 question 2 module EF4', 'intitule reponse 3 question 2 module EF4', 0),
(12, 4, 'intitule question 3 module EF4', 'intitule reponse 1 question 3 module EF4', 'intitule reponse 2 question 3 module EF4', 'intitule reponse 3 question 3 module EF4', 1),
(13, 5, 'intitule question 1 module WEB-INFO2', 'intitule reponse 1 question 1 module WEB-INFO2', 'intitule reponse 2 question 1 module WEB-INFO2', 'intitule reponse 3 question 1 module WEB-INFO2', 0),
(14, 5, 'intitule question 2 module WEB-INFO2', 'intitule reponse 1 question 2 module WEB-INFO2', 'intitule reponse 2 question 2 module WEB-INFO2', 'intitule reponse 3 question 2 module WEB-INFO2', 0),
(15, 5, 'intitule question 3 module WEB-INFO2', 'intitule reponse 1 question 3 module WEB-INFO2', 'intitule reponse 2 question 3 module WEB-INFO2', 'intitule reponse 3 question 3 module WEB-INFO2', 1),
(16, 6, 'intitule question 1 module WEB-MI3', 'intitule reponse 1 question 1 module WEB-MI3', 'intitule reponse 2 question 1 module WEB-MI3', 'intitule reponse 3 question 1 module WEB-MI3', 0),
(17, 6, 'intitule question 2 module WEB-MI3', 'intitule reponse 1 question 2 module WEB-MI3', 'intitule reponse 2 question 2 module WEB-MI3', 'intitule reponse 3 question 2 module WEB-MI3', 0),
(18, 6, 'intitule question 3 module WEB-MI3', 'intitule reponse 1 question 3 module WEB-MI3', 'intitule reponse 2 question 3 module WEB-MI3', 'intitule reponse 3 question 3 module WEB-MI3', 1),
(19, 7, 'intitule question 1 module WEB-MI4', 'intitule reponse 1 question 1 module WEB-MI4', 'intitule reponse 2 question 1 module WEB-MI4', 'intitule reponse 3 question 1 module WEB-MI4', 0),
(20, 7, 'intitule question 2 module WEB-MI4', 'intitule reponse 1 question 2 module WEB-MI4', 'intitule reponse 2 question 2 module WEB-MI4', 'intitule reponse 3 question 2 module WEB-MI4', 0),
(21, 7, 'intitule question 3 module WEB-MI4', 'intitule reponse 1 question 3 module WEB-MI4', 'intitule reponse 2 question 3 module WEB-MI4', 'intitule reponse 3 question 3 module WEB-MI4', 1);

-- --------------------------------------------------------

--
-- Structure de la table `reponse`
--

CREATE TABLE `reponse` (
  `id` int(11) NOT NULL,
  `bonneReponse1` int(11) NOT NULL,
  `bonneReponse2` int(11) NOT NULL,
  `bonneReponse3` int(11) NOT NULL,
  `questionId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Contenu de la table `reponse`
--

INSERT INTO `reponse` (`id`, `bonneReponse1`, `bonneReponse2`, `bonneReponse3`, `questionId`) VALUES
(1, 1, 1, 0, 1),
(2, 0, 1, 0, 2),
(3, 1, 0, 0, 3),
(4, 1, 0, 1, 4),
(5, 1, 0, 0, 5),
(6, 1, 0, 0, 6),
(7, 0, 0, 1, 7),
(8, 0, 1, 0, 8),
(9, 1, 1, 0, 9),
(10, 0, 1, 0, 10),
(11, 1, 0, 0, 11),
(12, 0, 1, 1, 12),
(13, 0, 1, 0, 13),
(14, 1, 0, 0, 14),
(15, 1, 1, 1, 15),
(16, 1, 0, 0, 16),
(17, 0, 0, 1, 17),
(18, 1, 1, 1, 18),
(19, 1, 0, 0, 19),
(20, 0, 0, 1, 20),
(21, 1, 0, 1, 21);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `module`
--
ALTER TABLE `module`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `module_niveau`
--
ALTER TABLE `module_niveau`
  ADD PRIMARY KEY (`moduleId`,`niveauId`),
  ADD KEY `moduleId` (`moduleId`),
  ADD KEY `niveauId` (`niveauId`),
  ADD KEY `moduleId_2` (`moduleId`,`niveauId`);

--
-- Index pour la table `niveau`
--
ALTER TABLE `niveau`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD KEY `moduleId` (`moduleId`);

--
-- Index pour la table `reponse`
--
ALTER TABLE `reponse`
  ADD PRIMARY KEY (`id`),
  ADD KEY `questionId` (`questionId`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `module`
--
ALTER TABLE `module`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT pour la table `niveau`
--
ALTER TABLE `niveau`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT pour la table `question`
--
ALTER TABLE `question`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT pour la table `reponse`
--
ALTER TABLE `reponse`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `module_niveau`
--
ALTER TABLE `module_niveau`
  ADD CONSTRAINT `moduleId` FOREIGN KEY (`moduleId`) REFERENCES `module` (`id`),
  ADD CONSTRAINT `niveauId` FOREIGN KEY (`niveauId`) REFERENCES `niveau` (`id`);

--
-- Contraintes pour la table `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `question_module` FOREIGN KEY (`moduleId`) REFERENCES `module` (`id`);

--
-- Contraintes pour la table `reponse`
--
ALTER TABLE `reponse`
  ADD CONSTRAINT `reponse_question` FOREIGN KEY (`questionId`) REFERENCES `question` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

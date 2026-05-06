-- =================================================================
-- COLLÈGE ASIMOV — Base de données Normalisée & Jeu de test
-- =================================================================
-- Mot de passe de TOUS les comptes : Asimov2025!
-- Hash bcrypt (salt=10) : $2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa
-- =================================================================

CREATE DATABASE IF NOT EXISTS college_asimov CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE college_asimov;

-- Désactiver les vérifications FK pendant la suppression/insertion
SET FOREIGN_KEY_CHECKS = 0;

-- =================================================================
-- NETTOYAGE DES ANCIENNES TABLES
-- =================================================================
DROP TABLE IF EXISTS Demandes_Bourse;
DROP TABLE IF EXISTS Participations_Projet;
DROP TABLE IF EXISTS Conventions_Stage;
DROP TABLE IF EXISTS Recherches_Stage;
DROP TABLE IF EXISTS Moyennes_Semestrielles;
DROP TABLE IF EXISTS Inscriptions;
DROP TABLE IF EXISTS Classes;
DROP TABLE IF EXISTS Eleve_Option;
DROP TABLE IF EXISTS Eleve_Parent;
DROP TABLE IF EXISTS Parents;
DROP TABLE IF EXISTS Eleves;
DROP TABLE IF EXISTS Professeurs;
DROP TABLE IF EXISTS Projets;
DROP TABLE IF EXISTS Options;
DROP TABLE IF EXISTS Utilisateurs;

-- =================================================================
-- CRÉATION DES TABLES
-- =================================================================

CREATE TABLE Utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Eleve', 'Professeur', 'Parent', 'Secretariat', 'Proviseur') NOT NULL
);

CREATE TABLE Options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Projets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    description TEXT,
    valide_par_commission BOOLEAN DEFAULT FALSE
);

CREATE TABLE Professeurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL UNIQUE,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateurs(id) ON DELETE CASCADE
);

CREATE TABLE Eleves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL UNIQUE,
    identifiant_csv VARCHAR(50) UNIQUE, 
    referent_id INT,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (referent_id) REFERENCES Professeurs(id) ON DELETE SET NULL
);

CREATE TABLE Parents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL UNIQUE,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateurs(id) ON DELETE CASCADE
);

CREATE TABLE Eleve_Parent (
    eleve_id INT NOT NULL,
    parent_id INT NOT NULL,
    PRIMARY KEY (eleve_id, parent_id),
    FOREIGN KEY (eleve_id) REFERENCES Eleves(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES Parents(id) ON DELETE CASCADE
);

CREATE TABLE Eleve_Option (
    eleve_id INT NOT NULL,
    option_id INT NOT NULL,
    PRIMARY KEY (eleve_id, option_id),
    FOREIGN KEY (eleve_id) REFERENCES Eleves(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES Options(id) ON DELETE CASCADE
);

CREATE TABLE Classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    annee_scolaire VARCHAR(9) NOT NULL, 
    niveau INT NOT NULL,                
    lettre CHAR(1) NOT NULL,            
    professeur_principal_id INT,        
    FOREIGN KEY (professeur_principal_id) REFERENCES Professeurs(id) ON DELETE SET NULL,
    UNIQUE (annee_scolaire, niveau, lettre) 
);

CREATE TABLE Inscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eleve_id INT NOT NULL,
    classe_id INT NOT NULL,
    FOREIGN KEY (eleve_id) REFERENCES Eleves(id) ON DELETE CASCADE,
    FOREIGN KEY (classe_id) REFERENCES Classes(id) ON DELETE CASCADE,
    UNIQUE (eleve_id, classe_id)
);

CREATE TABLE Moyennes_Semestrielles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inscription_id INT NOT NULL,
    semestre INT NOT NULL,
    moyenne_generale DECIMAL(4,2) NOT NULL,
    validee_par_proviseur BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (inscription_id) REFERENCES Inscriptions(id) ON DELETE CASCADE
);

CREATE TABLE Recherches_Stage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eleve_id INT NOT NULL,
    nom_entreprise VARCHAR(150) NOT NULL,
    nom_contact VARCHAR(100),
    coordonnees_contact VARCHAR(255),
    lettres_envoyees INT DEFAULT 0,
    lettres_recues INT DEFAULT 0,
    date_entretien DATE,
    resultat VARCHAR(50) DEFAULT 'En attente',
    FOREIGN KEY (eleve_id) REFERENCES Eleves(id) ON DELETE CASCADE
);

CREATE TABLE Conventions_Stage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eleve_id INT NOT NULL,
    nom_entreprise VARCHAR(150) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    fichier_convention_pdf VARCHAR(255),
    fichier_attestation_pdf VARCHAR(255),
    signature_eleve BOOLEAN DEFAULT FALSE,
    signature_parent BOOLEAN DEFAULT FALSE, 
    validation_prof_referent BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (eleve_id) REFERENCES Eleves(id) ON DELETE CASCADE
);

CREATE TABLE Participations_Projet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    projet_id INT NOT NULL,
    eleve_id INT NOT NULL,
    role VARCHAR(100) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE,
    FOREIGN KEY (projet_id) REFERENCES Projets(id) ON DELETE CASCADE,
    FOREIGN KEY (eleve_id) REFERENCES Eleves(id) ON DELETE CASCADE
);

CREATE TABLE Demandes_Bourse (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eleve_id INT NOT NULL,
    date_demande DATE DEFAULT (CURRENT_DATE),
    statut ENUM('En attente', 'Acceptée', 'Refusée') DEFAULT 'En attente',
    traitee_par INT,
    date_traitement DATE,
    FOREIGN KEY (eleve_id) REFERENCES Eleves(id) ON DELETE CASCADE,
    FOREIGN KEY (traitee_par) REFERENCES Utilisateurs(id) ON DELETE SET NULL
);


-- =================================================================
-- INSERTION DES DONNÉES
-- =================================================================

-- 1. UTILISATEURS
INSERT INTO Utilisateurs (id, nom, prenom, email, password_hash, role) VALUES
(1,  'Moreau',     'Isabelle',  'i.moreau@college-asimov.fr',      '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Proviseur'),
(2,  'Fontaine',   'Nathalie',  'n.fontaine@college-asimov.fr',    '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Secretariat'),
(3,  'Bernard',    'François',  'f.bernard@college-asimov.fr',     '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Professeur'),
(4,  'Lefèvre',    'Sophie',    's.lefevre@college-asimov.fr',      '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Professeur'),
(5,  'Dupuis',     'Alain',     'a.dupuis@college-asimov.fr',       '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Professeur'),
(6,  'Martin',     'Claire',    'c.martin@college-asimov.fr',       '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Professeur'),
(7,  'Durand',     'Lucas',     'lucas.durand@eleve-asimov.fr',    '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Eleve'),
(8,  'Simon',      'Emma',      'emma.simon@eleve-asimov.fr',      '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Eleve'),
(9,  'Petit',      'Hugo',      'hugo.petit@eleve-asimov.fr',      '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Eleve'),
(10, 'Laurent',    'Chloé',     'chloe.laurent@eleve-asimov.fr',   '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Eleve'),
(11, 'Garcia',     'Nathan',    'nathan.garcia@eleve-asimov.fr',   '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Eleve'),
(12, 'Robert',     'Léa',       'lea.robert@eleve-asimov.fr',      '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Eleve'),
(13, 'Roux',       'Tom',       'tom.roux@eleve-asimov.fr',        '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Eleve'),
(14, 'Vincent',    'Inès',      'ines.vincent@eleve-asimov.fr',    '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Eleve'),
(15, 'Leroy',      'Mathis',    'mathis.leroy@eleve-asimov.fr',    '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Eleve'),
(16, 'Moreau',     'Camille',   'camille.moreau@eleve-asimov.fr',  '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Eleve'),
(17, 'Durand',     'Pierre',    'pierre.durand@mail.fr',           '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Parent'),
(18, 'Simon',      'Martine',   'martine.simon@mail.fr',           '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Parent'),
(19, 'Petit',      'Jean-Luc',  'jeanluc.petit@mail.fr',           '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Parent'),
(20, 'Laurent',    'Christine', 'christine.laurent@mail.fr',       '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Parent'),
(21, 'Garcia',     'Roberto',   'roberto.garcia@mail.fr',          '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Parent'),
(22, 'Robert',     'Sylvie',    'sylvie.robert@mail.fr',           '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Parent');

-- 2. OPTIONS & PROJETS
INSERT INTO Options (id, nom) VALUES (1, 'Informatique'), (2, 'Électricité'), (3, 'Langues vivantes renforcées'), (4, 'Sport');
INSERT INTO Projets (id, nom, description, valide_par_commission) VALUES
(1, 'Jardin pédagogique', 'Création et entretien d''un jardin potager.', TRUE),
(2, 'Radio scolaire', 'Émissions hebdomadaires.', TRUE),
(3, 'Tournoi e-sport', 'Compétition inter-classes.', FALSE),
(4, 'Fresque murale', 'Réalisation d''une fresque.', FALSE);

-- 3. PROFESSEURS
INSERT INTO Professeurs (id, utilisateur_id) VALUES (1, 3), (2, 4), (3, 5), (4, 6);

-- 4. ÉLÈVES & PARENTS
INSERT INTO Eleves (id, utilisateur_id, identifiant_csv, referent_id) VALUES
(1, 7, 'ELV-001', 1), (2, 8, 'ELV-002', 1), (3, 9, 'ELV-003', 2), (4, 10, 'ELV-004', 2), 
(5, 11, 'ELV-005', 3), (6, 12, 'ELV-006', 3), (7, 13, 'ELV-007', 4), (8, 14, 'ELV-008', 4), 
(9, 15, 'ELV-009', 1), (10, 16, 'ELV-010', 2);

INSERT INTO Parents (id, utilisateur_id) VALUES (1, 17), (2, 18), (3, 19), (4, 20), (5, 21), (6, 22);

INSERT INTO Eleve_Parent (eleve_id, parent_id) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 1), (8, 2), (9, 3), (10, 4);

INSERT INTO Eleve_Option (eleve_id, option_id) VALUES
(1, 1), (1, 2), (2, 3), (2, 4), (3, 1), (3, 4), (4, 2), (5, 1), (5, 3), (6, 4), (7, 2), (7, 4), (8, 3), (9, 1), (9, 2), (10, 3), (10, 4);

-- 5. CLASSES (NOUVEAU)
INSERT INTO Classes (id, annee_scolaire, niveau, lettre, professeur_principal_id) VALUES 
(1, '2025-2026', 3, 'A', 1),
(2, '2025-2026', 3, 'B', 2),
(3, '2025-2026', 4, 'A', 3),
(4, '2025-2026', 4, 'B', 4),
(5, '2025-2026', 5, 'A', 1),
(6, '2025-2026', 5, 'B', 2),
(7, '2025-2026', 6, 'A', 3),
(8, '2025-2026', 6, 'B', 4),
-- Historique 2024-2025
(9, '2024-2025', 4, 'A', 1),
(10, '2024-2025', 4, 'B', 2),
(11, '2024-2025', 5, 'A', 3);

-- 6. INSCRIPTIONS (Lien Élève <-> Classe)
INSERT INTO Inscriptions (id, eleve_id, classe_id) VALUES
(1, 1, 1),  (2, 2, 2),  (3, 3, 3),  (4, 4, 4),  (5, 5, 5),
(6, 6, 6),  (7, 7, 7),  (8, 8, 8),  (9, 9, 1),  (10, 10, 3),
-- Historique 2024-2025
(11, 1, 9), (12, 2, 10), (13, 3, 11), (14, 9, 10), (15, 10, 11);

-- 7. MOYENNES SEMESTRIELLES
INSERT INTO Moyennes_Semestrielles (id, inscription_id, semestre, moyenne_generale, validee_par_proviseur) VALUES
(1, 1, 1, 14.25, TRUE), (2, 1, 2, 15.00, FALSE),
(3, 2, 1, 16.80, TRUE), (4, 2, 2, 17.20, TRUE),
(5, 3, 1, 11.50, TRUE), (6, 3, 2, 12.40, FALSE),
(7, 4, 1, 13.75, TRUE), (8, 4, 2, 14.10, FALSE),
(9, 5, 1, 09.80, FALSE), (10, 5, 2, 10.30, FALSE),
(11, 6, 1, 17.50, TRUE), (12, 6, 2, 18.00, TRUE),
(13, 7, 1, 12.00, FALSE), (14, 7, 2, 13.50, FALSE),
(15, 8, 1, 15.25, TRUE), (16, 8, 2, 14.90, FALSE),
(17, 9, 1, 08.50, TRUE), (18, 9, 2, 09.00, FALSE),
(19, 10, 1, 18.25, TRUE), (20, 10, 2, 19.00, TRUE),
(21, 11, 1, 13.00, TRUE), (22, 11, 2, 13.80, TRUE),
(23, 12, 1, 15.60, TRUE), (24, 12, 2, 16.40, TRUE);

-- 8. RECHERCHES, CONVENTIONS ET PROJETS
INSERT INTO Recherches_Stage (eleve_id, nom_entreprise, nom_contact, coordonnees_contact, lettres_envoyees, lettres_recues, date_entretien, resultat) VALUES
(1, 'Orange SA', 'M. Leconte', '01 40 00 00 00', 1, 1, '2026-02-10', 'Accepté'),
(1, 'EDF', 'Mme Chaput', 'a@edf.fr', 2, 1, '2026-02-17', 'Refusé'),
(2, 'Ministère', 'M. Roux', 'roux@educ.fr', 1, 1, '2026-03-04', 'Accepté'),
(3, 'SNCF', 'M. Vidal', '01 53 90 00 00', 2, 0, NULL, 'En attente'),
(5, 'Decathlon', 'M. Guérin', '01 60 13 22 44', 1, 1, '2026-03-12', 'Accepté');

INSERT INTO Conventions_Stage (eleve_id, nom_entreprise, date_debut, date_fin, fichier_convention_pdf, fichier_attestation_pdf, signature_eleve, signature_parent, validation_prof_referent) VALUES
(1, 'Orange SA', '2026-03-23', '2026-04-03', 'conv_lucas.pdf', NULL, TRUE, TRUE, TRUE),
(2, 'Ministère', '2026-03-23', '2026-04-03', 'conv_emma.pdf', 'attest_emma.pdf', TRUE, TRUE, TRUE),
(5, 'Decathlon', '2026-04-06', '2026-04-17', 'conv_nathan.pdf', NULL, TRUE, FALSE, FALSE);

INSERT INTO Participations_Projet (projet_id, eleve_id, role, date_debut, date_fin) VALUES
(1, 6, 'Responsable', '2025-09-15', NULL), (1, 7, 'Participant', '2025-09-15', NULL),
(2, 1, 'Responsable', '2025-10-01', NULL), (2, 2, 'Participant', '2025-10-01', NULL),
(3, 3, 'Responsable', '2026-01-10', NULL), (3, 5, 'Participant', '2026-01-10', NULL),
(4, 4, 'Responsable', '2026-02-15', NULL), (4, 10, 'Participant', '2026-02-15', NULL);

SET FOREIGN_KEY_CHECKS = 1;
-- Création de la base
CREATE DATABASE IF NOT EXISTS asimov_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE asimov_db;

-- =======================================================
-- 1. TABLES INDÉPENDANTES (Référentiels et Utilisateurs)
-- =======================================================

-- Table centrale pour tous les acteurs (permet l'authentification centralisée)
CREATE TABLE Utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Obligatoire pour la sécurité (Abuser stories)
    role ENUM('Eleve', 'Professeur', 'Parent', 'Secretariat', 'Proviseur') NOT NULL
);

-- Référentiel des options disponibles le mercredi après-midi
CREATE TABLE Options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE -- ex: 'informatique', 'électricité', 'langues'
);

-- Projets du lycée (doivent être validés par une commission)
CREATE TABLE Projets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    description TEXT,
    valide_par_commission BOOLEAN DEFAULT FALSE -- Spécificité du cahier des charges
);

-- =======================================================
-- 2. TABLES LIÉES AUX UTILISATEURS (Héritage logique)
-- =======================================================

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

-- Table de liaison pour l'envoi de courriels et signatures (Un élève a un/des parents)
CREATE TABLE Eleve_Parent (
    eleve_id INT NOT NULL,
    parent_id INT NOT NULL,
    PRIMARY KEY (eleve_id, parent_id),
    FOREIGN KEY (eleve_id) REFERENCES Eleves(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES Parents(id) ON DELETE CASCADE
);

-- Les élèves choisissent jusqu'à 2 options
CREATE TABLE Eleve_Option (
    eleve_id INT NOT NULL,
    option_id INT NOT NULL,
    PRIMARY KEY (eleve_id, option_id),
    FOREIGN KEY (eleve_id) REFERENCES Eleves(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES Options(id) ON DELETE CASCADE
);

-- =======================================================
-- 3. SCOLARITÉ ET ÉVALUATIONS
-- =======================================================

-- Historique des classes d'un élève (ex: 6C, 5A)
CREATE TABLE Inscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eleve_id INT NOT NULL,
    annee_scolaire VARCHAR(9) NOT NULL, -- ex: '2025-2026'
    niveau INT NOT NULL, -- ex: 6, 5, 4, 3
    lettre_classe CHAR(1) NOT NULL, -- ex: 'C'
    FOREIGN KEY (eleve_id) REFERENCES Eleves(id) ON DELETE CASCADE
);

-- Moyennes semestrielles (Soumises à validation stricte)
CREATE TABLE Moyennes_Semestrielles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inscription_id INT NOT NULL,
    semestre INT NOT NULL, -- 1 ou 2
    moyenne_generale DECIMAL(4,2) NOT NULL,
    validee_par_proviseur BOOLEAN DEFAULT FALSE, -- Verrou de modification
    FOREIGN KEY (inscription_id) REFERENCES Inscriptions(id) ON DELETE CASCADE
);

-- =======================================================
-- 4. STAGES ET PROJETS (Suivi des activités)
-- =======================================================

-- Suivi granulaire des recherches (pour l'alerte > 15 entreprises)
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

-- Conventions signées et attestations
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

-- Investissement dans les projets de l'établissement
CREATE TABLE Participations_Projet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    projet_id INT NOT NULL,
    eleve_id INT NOT NULL,
    role VARCHAR(100) NOT NULL, -- ex: 'Responsable', 'Participant'
    date_debut DATE NOT NULL,
    date_fin DATE,
    FOREIGN KEY (projet_id) REFERENCES Projets(id) ON DELETE CASCADE,
    FOREIGN KEY (eleve_id) REFERENCES Eleves(id) ON DELETE CASCADE
);
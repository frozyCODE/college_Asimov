-- =================================================================
-- COLLÈGE ASIMOV — Jeu de données de test
-- =================================================================
-- Mot de passe de TOUS les comptes : email 
-- Hash bcrypt (salt=10) : $2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa
-- =================================================================

USE college_asimov;

-- Désactiver les vérifications FK pendant l'insertion
SET FOREIGN_KEY_CHECKS = 0;

-- Vider les tables dans l'ordre inverse des dépendances
TRUNCATE TABLE Participations_Projet;
TRUNCATE TABLE Conventions_Stage;
TRUNCATE TABLE Recherches_Stage;
TRUNCATE TABLE Moyennes_Semestrielles;
TRUNCATE TABLE Inscriptions;
TRUNCATE TABLE Eleve_Option;
TRUNCATE TABLE Eleve_Parent;
TRUNCATE TABLE Parents;
TRUNCATE TABLE Eleves;
TRUNCATE TABLE Professeurs;
TRUNCATE TABLE Projets;
TRUNCATE TABLE Options;
TRUNCATE TABLE Utilisateurs;

SET FOREIGN_KEY_CHECKS = 1;

-- =================================================================
-- 1. UTILISATEURS
-- =================================================================
-- Mot de passe commun : Asimov2025!
-- Hash : $2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa

INSERT INTO Utilisateurs (id, nom, prenom, email, password_hash, role) VALUES
-- Proviseur (id=1)
(1,  'Moreau',     'Isabelle',  'i.moreau@college-asimov.fr',      '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Proviseur'),

-- Secrétariat (id=2)
(2,  'Fontaine',   'Nathalie',  'n.fontaine@college-asimov.fr',    '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Secretariat'),

-- Professeurs (id=3..6)
(3,  'Bernard',    'François',  'f.bernard@college-asimov.fr',     '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Professeur'),
(4,  'Lefèvre',    'Sophie',    's.lefevre@college-asimov.fr',      '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Professeur'),
(5,  'Dupuis',     'Alain',     'a.dupuis@college-asimov.fr',       '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Professeur'),
(6,  'Martin',     'Claire',    'c.martin@college-asimov.fr',       '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Professeur'),

-- Élèves (id=7..16)
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

-- Parents (id=17..22)
(17, 'Durand',     'Pierre',    'pierre.durand@mail.fr',           '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Parent'),
(18, 'Simon',      'Martine',   'martine.simon@mail.fr',           '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Parent'),
(19, 'Petit',      'Jean-Luc',  'jeanluc.petit@mail.fr',           '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Parent'),
(20, 'Laurent',    'Christine', 'christine.laurent@mail.fr',       '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Parent'),
(21, 'Garcia',     'Roberto',   'roberto.garcia@mail.fr',          '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Parent'),
(22, 'Robert',     'Sylvie',    'sylvie.robert@mail.fr',           '$2b$10$9YLnHiWesjnvi57SrljRa.h4ZeiPGervK2OUyNH3/tj407IkkngEa', 'Parent');

-- =================================================================
-- 2. OPTIONS
-- =================================================================
INSERT INTO Options (id, nom) VALUES
(1, 'Informatique'),
(2, 'Électricité'),
(3, 'Langues vivantes renforcées'),
(4, 'Sport');

-- =================================================================
-- 3. PROJETS
-- =================================================================
INSERT INTO Projets (id, nom, description, valide_par_commission) VALUES
(1, 'Jardin pédagogique',       'Création et entretien d''un jardin potager dans la cour du collège.',                    TRUE),
(2, 'Radio scolaire Asimov FM', 'Émissions hebdomadaires animées par les élèves de 4ème et 3ème.',                       TRUE),
(3, 'Tournoi e-sport',          'Compétition inter-classes en jeux éducatifs sur tablette.',                             FALSE),
(4, 'Fresque murale',           'Réalisation d''une fresque artistique dans le couloir du bâtiment principal.',           FALSE);

-- =================================================================
-- 4. PROFESSEURS
-- =================================================================
INSERT INTO Professeurs (id, utilisateur_id) VALUES
(1, 3),   -- François Bernard
(2, 4),   -- Sophie Lefèvre
(3, 5),   -- Alain Dupuis
(4, 6);   -- Claire Martin

-- =================================================================
-- 5. ÉLÈVES
-- =================================================================
-- referent_id : chaque élève est suivi par un professeur référent
INSERT INTO Eleves (id, utilisateur_id, identifiant_csv, referent_id) VALUES
(1,  7,  'ELV-001', 1),   -- Lucas Durand       → Bernard
(2,  8,  'ELV-002', 1),   -- Emma Simon         → Bernard
(3,  9,  'ELV-003', 2),   -- Hugo Petit         → Lefèvre
(4,  10, 'ELV-004', 2),   -- Chloé Laurent      → Lefèvre
(5,  11, 'ELV-005', 3),   -- Nathan Garcia      → Dupuis
(6,  12, 'ELV-006', 3),   -- Léa Robert         → Dupuis
(7,  13, 'ELV-007', 4),   -- Tom Roux           → Martin
(8,  14, 'ELV-008', 4),   -- Inès Vincent       → Martin
(9,  15, 'ELV-009', 1),   -- Mathis Leroy       → Bernard
(10, 16, 'ELV-010', 2);   -- Camille Moreau     → Lefèvre

-- =================================================================
-- 6. PARENTS
-- =================================================================
INSERT INTO Parents (id, utilisateur_id) VALUES
(1, 17),  -- Pierre Durand
(2, 18),  -- Martine Simon
(3, 19),  -- Jean-Luc Petit
(4, 20),  -- Christine Laurent
(5, 21),  -- Roberto Garcia
(6, 22);  -- Sylvie Robert

-- =================================================================
-- 7. LIAISONS ÉLÈVE ↔ PARENT
-- =================================================================
INSERT INTO Eleve_Parent (eleve_id, parent_id) VALUES
(1, 1),   -- Lucas Durand    ← Pierre Durand
(2, 2),   -- Emma Simon      ← Martine Simon
(3, 3),   -- Hugo Petit      ← Jean-Luc Petit
(4, 4),   -- Chloé Laurent   ← Christine Laurent
(5, 5),   -- Nathan Garcia   ← Roberto Garcia
(6, 6),   -- Léa Robert      ← Sylvie Robert
(7, 1),   -- Tom Roux        ← Pierre Durand (parent de tutelle)
(8, 2),   -- Inès Vincent    ← Martine Simon (parent de tutelle)
(9, 3),   -- Mathis Leroy    ← Jean-Luc Petit
(10,4);   -- Camille Moreau  ← Christine Laurent

-- =================================================================
-- 8. LIAISONS ÉLÈVE ↔ OPTION (max 2 par élève)
-- =================================================================
INSERT INTO Eleve_Option (eleve_id, option_id) VALUES
(1, 1), (1, 2),   -- Lucas      : Informatique + Électricité
(2, 3), (2, 4),   -- Emma       : Langues + Sport
(3, 1), (3, 4),   -- Hugo       : Informatique + Sport
(4, 2),           -- Chloé      : Électricité
(5, 1), (5, 3),   -- Nathan     : Informatique + Langues
(6, 4),           -- Léa        : Sport
(7, 2), (7, 4),   -- Tom        : Électricité + Sport
(8, 3),           -- Inès       : Langues
(9, 1), (9, 2),   -- Mathis     : Informatique + Électricité
(10,3), (10,4);   -- Camille    : Langues + Sport

-- =================================================================
-- 9. INSCRIPTIONS (2025-2026 + historique 2024-2025 pour certains)
-- =================================================================
INSERT INTO Inscriptions (id, eleve_id, annee_scolaire, niveau, lettre_classe) VALUES
-- Année courante 2025-2026
(1,  1,  '2025-2026', 3, 'A'),   -- Lucas     → 3ème A
(2,  2,  '2025-2026', 3, 'B'),   -- Emma      → 3ème B
(3,  3,  '2025-2026', 4, 'A'),   -- Hugo      → 4ème A
(4,  4,  '2025-2026', 4, 'B'),   -- Chloé     → 4ème B
(5,  5,  '2025-2026', 5, 'A'),   -- Nathan    → 5ème A
(6,  6,  '2025-2026', 5, 'B'),   -- Léa       → 5ème B
(7,  7,  '2025-2026', 6, 'A'),   -- Tom       → 6ème A
(8,  8,  '2025-2026', 6, 'B'),   -- Inès      → 6ème B
(9,  9,  '2025-2026', 3, 'A'),   -- Mathis    → 3ème A
(10, 10, '2025-2026', 4, 'A'),   -- Camille   → 4ème A
-- Historique 2024-2025
(11, 1,  '2024-2025', 4, 'A'),   -- Lucas était en 4ème A
(12, 2,  '2024-2025', 4, 'B'),   -- Emma  était en 4ème B
(13, 3,  '2024-2025', 5, 'A'),   -- Hugo  était en 5ème A
(14, 9,  '2024-2025', 4, 'B'),   -- Mathis était en 4ème B
(15, 10, '2024-2025', 5, 'A');   -- Camille était en 5ème A

-- =================================================================
-- 10. MOYENNES SEMESTRIELLES
-- =================================================================
INSERT INTO Moyennes_Semestrielles (id, inscription_id, semestre, moyenne_generale, validee_par_proviseur) VALUES
-- Lucas Durand — 3A (insc_id=1)
(1,  1,  1, 14.25, TRUE),
(2,  1,  2, 15.00, FALSE),
-- Emma Simon — 3B (insc_id=2)
(3,  2,  1, 16.80, TRUE),
(4,  2,  2, 17.20, TRUE),
-- Hugo Petit — 4A (insc_id=3)
(5,  3,  1, 11.50, TRUE),
(6,  3,  2, 12.40, FALSE),
-- Chloé Laurent — 4B (insc_id=4)
(7,  4,  1, 13.75, TRUE),
(8,  4,  2, 14.10, FALSE),
-- Nathan Garcia — 5A (insc_id=5)
(9,  5,  1, 09.80, FALSE),
(10, 5,  2, 10.30, FALSE),
-- Léa Robert — 5B (insc_id=6)
(11, 6,  1, 17.50, TRUE),
(12, 6,  2, 18.00, TRUE),
-- Tom Roux — 6A (insc_id=7)
(13, 7,  1, 12.00, FALSE),
(14, 7,  2, 13.50, FALSE),
-- Inès Vincent — 6B (insc_id=8)
(15, 8,  1, 15.25, TRUE),
(16, 8,  2, 14.90, FALSE),
-- Mathis Leroy — 3A (insc_id=9)
(17, 9,  1, 08.50, TRUE),
(18, 9,  2, 09.00, FALSE),
-- Camille Moreau — 4A (insc_id=10)
(19, 10, 1, 18.25, TRUE),
(20, 10, 2, 19.00, TRUE),
-- Historiques 2024-2025 — Lucas (insc_id=11)
(21, 11, 1, 13.00, TRUE),
(22, 11, 2, 13.80, TRUE),
-- Emma 2024-2025 (insc_id=12)
(23, 12, 1, 15.60, TRUE),
(24, 12, 2, 16.40, TRUE);

-- =================================================================
-- 11. RECHERCHES DE STAGE
-- =================================================================
INSERT INTO Recherches_Stage (eleve_id, nom_entreprise, nom_contact, coordonnees_contact, lettres_envoyees, lettres_recues, date_entretien, resultat) VALUES
-- Lucas Durand (eleve_id=1)
(1, 'Orange SA',          'M. Leconte',    '01 40 00 00 00', 1, 1, '2026-02-10', 'Accepté'),
(1, 'EDF Île-de-France',  'Mme Chaput',    'a.chaput@edf.fr',2, 1, '2026-02-17', 'Refusé'),
(1, 'Renault Évry',       'M. Arnaud',     '01 69 11 22 33', 1, 0, NULL,          'En attente'),
-- Emma Simon (eleve_id=2)
(2, 'Ministère Éducation','M. Roux',       'roux@educ.gouv.fr',1,1, '2026-03-04', 'Accepté'),
(2, 'Médiathèque Orsay',  'Mme Blanchard', '01 60 92 64 22', 1, 1, '2026-02-25', 'En attente'),
-- Hugo Petit (eleve_id=3)
(3, 'SNCF Voyageurs',     'M. Vidal',      '01 53 90 00 00', 2, 0, NULL,          'En attente'),
(3, 'Air France Tech',    'Mme Perrin',    'j.perrin@airfrance.fr',1,0,NULL,       'Refusé'),
-- Nathan Garcia (eleve_id=5)
(5, 'Decathlon Massy',    'M. Guérin',     '01 60 13 22 44', 1, 1, '2026-03-12', 'Accepté'),
(5, 'Carrefour Palaiseau','Mme Sabatier',  '01 69 34 22 10', 1, 0, NULL,          'En attente');

-- =================================================================
-- 12. CONVENTIONS DE STAGE
-- =================================================================
INSERT INTO Conventions_Stage (eleve_id, nom_entreprise, date_debut, date_fin, fichier_convention_pdf, fichier_attestation_pdf, signature_eleve, signature_parent, validation_prof_referent) VALUES
(1, 'Orange SA',           '2026-03-23', '2026-04-03', 'convention_lucas_orange.pdf',     NULL,                          TRUE,  TRUE,  TRUE),
(2, 'Ministère Éducation', '2026-03-23', '2026-04-03', 'convention_emma_ministere.pdf',   'attestation_emma.pdf',        TRUE,  TRUE,  TRUE),
(5, 'Decathlon Massy',     '2026-04-06', '2026-04-17', 'convention_nathan_decathlon.pdf', NULL,                          TRUE,  FALSE, FALSE);

-- =================================================================
-- 13. PARTICIPATIONS AUX PROJETS
-- =================================================================
INSERT INTO Participations_Projet (projet_id, eleve_id, role, date_debut, date_fin) VALUES
-- Jardin pédagogique (projet_id=1)
(1, 6,  'Responsable', '2025-09-15', NULL),           -- Léa
(1, 7,  'Participant',  '2025-09-15', NULL),           -- Tom
(1, 10, 'Participant',  '2025-09-15', '2026-01-20'),   -- Camille (a arrêté)
-- Radio scolaire (projet_id=2)
(2, 1,  'Responsable', '2025-10-01', NULL),            -- Lucas
(2, 2,  'Participant',  '2025-10-01', NULL),            -- Emma
(2, 9,  'Participant',  '2025-10-01', NULL),            -- Mathis
-- Tournoi e-sport (projet_id=3)
(3, 3,  'Responsable', '2026-01-10', NULL),            -- Hugo
(3, 5,  'Participant',  '2026-01-10', NULL),            -- Nathan
(3, 8,  'Participant',  '2026-02-01', NULL),            -- Inès
-- Fresque murale (projet_id=4)
(4, 4,  'Responsable', '2026-02-15', NULL),            -- Chloé
(4, 10, 'Participant',  '2026-02-15', NULL);            -- Camille

-- =================================================================
-- VÉRIFICATION RAPIDE
-- =================================================================
SELECT 'Utilisateurs' AS table_name, COUNT(*) AS total FROM Utilisateurs
UNION ALL SELECT 'Options',             COUNT(*) FROM Options
UNION ALL SELECT 'Projets',             COUNT(*) FROM Projets
UNION ALL SELECT 'Professeurs',         COUNT(*) FROM Professeurs
UNION ALL SELECT 'Eleves',              COUNT(*) FROM Eleves
UNION ALL SELECT 'Parents',             COUNT(*) FROM Parents
UNION ALL SELECT 'Eleve_Parent',        COUNT(*) FROM Eleve_Parent
UNION ALL SELECT 'Eleve_Option',        COUNT(*) FROM Eleve_Option
UNION ALL SELECT 'Inscriptions',        COUNT(*) FROM Inscriptions
UNION ALL SELECT 'Moyennes_Semes.',     COUNT(*) FROM Moyennes_Semestrielles
UNION ALL SELECT 'Recherches_Stage',    COUNT(*) FROM Recherches_Stage
UNION ALL SELECT 'Conventions_Stage',   COUNT(*) FROM Conventions_Stage
UNION ALL SELECT 'Participations_Proj.',COUNT(*) FROM Participations_Projet;

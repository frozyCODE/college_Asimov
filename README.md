API - Système de Gestion Scolaire

API REST pour la gestion du Collège Asimov. Ce projet fournit une infrastructure robuste pour la gestion des élèves, des professeurs, des inscriptions, des notes (moyennes) et du suivi des stages.

## Technologies

- **Backend** : Node.js avec Express 5.
- **Base de données** : MySQL (via `mysql2/promise`).
- **Sécurité** : JWT (JSON Web Tokens), bcrypt, Helmet, Express Rate Limit.
- **Validation** : Express-validator.
- **Documentation** : Standards JSDoc.

## Installation et démarrage

1.  **Installer les dépendances** :
    ```bash
    npm install
    ```

2.  **Configurer les variables d'environnement** :
    Créer un fichier `.env` à la racine :
    ```env
    PORT=3000
    DB_HOST=localhost
    DB_USER=votre_utilisateur
    DB_PASSWORD=votre_mot_de_passe
    DB_NAME=college_asimov
    JWT_SECRET=votre_secret_jwt
    ```

3.  **Initialiser la base de données** :
    Exécuter le script SQL présent dans `config/script.sql`.

4.  **Lancer le serveur** :
    ```bash
    node server.js
    ```

## Sécurité et Authentification

L'API est protégée par une authentification basée sur les jetons JWT.

1.  **Login** : Envoyer les identifiants à `/api/auth/login`.
2.  **Utilisation** : Inclure le token dans chaque requête suivante via le header HTTP :
    `Authorization: Bearer <votre_token>`

## Référence API (Points d'entrée)

### Authentification
- `POST /api/auth/login` : Authentification utilisateur.

### Administration
- `POST /api/admin/utilisateurs` : Création de comptes Proviseur ou Secrétariat (Proviseur uniquement).

### Élèves
- `GET /api/eleves` : Liste complète des élèves.
- `POST /api/eleves` : Création d'un élève.
- `PUT /api/eleves/:id` : Mise à jour d'un élève.
- `DELETE /api/eleves/:id` : Suppression d'un élève.

### Professeurs
- `GET /api/professeurs` : Liste des professeurs.
- `POST /api/professeurs` : Création d'un professeur.
- `PUT /api/professeurs/:id` : Mise à jour d'un professeur.
- `DELETE /api/professeurs/:id` : Suppression d'un professeur.

### Inscriptions
- `POST /api/inscriptions` : Inscrire un élève à une classe.
- `GET /api/inscriptions/eleve/:eleve_id` : Historique d'inscription d'un élève.
- `GET /api/inscriptions/classe` : Liste des élèves par classe.

### Moyennes et Notes
- `POST /api/moyennes` : Enregistrer une moyenne semestrielle.
- `GET /api/moyennes/inscription/:inscription_id` : Consulter les moyennes d'une inscription.
- `PATCH /api/moyennes/:id/valider` : Validation d'une moyenne (Proviseur uniquement).

### Enseignements Optionnels
- `GET /api/options` : Liste des options disponibles.
- `POST /api/options` : Création d'une option.
- `POST /api/options/choisir` : Inscription d'un élève à une option.
- `DELETE /api/options/retirer` : Désistement d'un élève d'une option.

### Parents
- `GET /api/parents` : Liste des comptes parents.
- `POST /api/parents` : Création d'un profil parent.
- `POST /api/parents/lier` : Lier un parent à un élève.

### Suivi des Stages
- `POST /api/stages/recherches` : Enregistrer une recherche d'entreprise.
- `GET /api/stages/alertes` : Liste des élèves nécessitant un suivi particulier (plus de 15 recherches sans succès).

## Gestion des Erreurs

L'API utilise des codes de statut HTTP standards :
- `200/201` : Succès.
- `400` : Requête invalide (erreur métier).
- `401` : Non authentifié.
- `403` : Accès interdit (rôle insuffisant).
- `404` : Ressource introuvable.
- `422` : Erreur de validation des données JSON.
- `500` : Erreur interne du serveur.

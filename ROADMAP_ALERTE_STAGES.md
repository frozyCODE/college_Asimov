# 🗺️ Feuille de Route Finale : Feature "Alerte Quota Stages 3ème"

## 🎯 Objectif Métier

Permettre au Proviseur d'identifier les élèves de **3ème** en situation critique (moins de **2 stages** validés) afin d'organiser un accompagnement personnalisé.

---

## 🏗️ Phase 1 : Cœur de Données (SQL)

L'intelligence de la feature repose sur une requête agrégée qui croise l'identité, la scolarité et l'effort de recherche.

**Requête SQL de Référence :**

```sql
SELECT
    u.nom, u.prenom, u.email,
    CONCAT(c.niveau, c.lettre) AS classe,
    COUNT(DISTINCT cs.id) AS nombre_stages,
    COUNT(DISTINCT rs.id) AS nombre_recherches
FROM Eleves e
JOIN Utilisateurs u ON e.utilisateur_id = u.id
JOIN Inscriptions i ON e.id = i.eleve_id
JOIN Classes c ON i.classe_id = c.id
LEFT JOIN Conventions_Stage cs ON e.id = cs.eleve_id
LEFT JOIN Recherches_Stage rs ON e.id = rs.eleve_id
WHERE c.niveau = 3
GROUP BY e.id, c.id
HAVING nombre_stages < 2
ORDER BY nombre_stages ASC, nombre_recherches DESC;

```

## 🚀 Phase 2 : Développement Backend (Node.js)

### 1. Model (`models/StageModel.js`)

Ajouter la méthode `getAlertesQuotaStages(seuil = 2)`.

Utiliser le paramètre `seuil` pour rendre la requête flexible.

### 2. Controller (`controllers/StageController.js`)

Créer `getAlertesQuotaStages3eme`.

Récupérer le seuil éventuel depuis `req.query.min`.

Utiliser `responseHelper` pour une réponse JSON uniforme.

### 3. Route (`routes/stageRoutes.js`)

Point d'accès : `GET /api/stages/alertes-quota`.

Sécurité : Middleware `autoriserRoles('Proviseur', 'Secretariat')`.

## 💻 Phase 3 : Interface Client (JavaFX)

### 1. Data Transfer Object (DTO)

Créer `AlerteStageDTO.java` avec les champs : `nom`, `prenom`, `email`, `classe`, `nbStages`, `nbRecherches`.

### 2. Service API (StageService.java)

Ajouter `recupererAlertesQuotaAsync()`.

Mapper le flux JSON vers une `List<AlerteStageDTO>`.

### 3. Vue UI

Ajouter un onglet "Alertes Stages" dans le dashboard Proviseur.

TableView avec colonnes triables.

Optionnel : Bouton "Envoyer Mail" qui ouvre le client mail avec l'email de l'élève.

## 🛡️ Phase 4 : Qualité & Sécurité

Test de rôle : Vérifier qu'un élève ne peut pas accéder à cette route (403).

Test de données : Vérifier que le `COUNT(DISTINCT)` fonctionne si un élève a plusieurs recherches en cours.

Performance : S'assurer que la requête s'exécute en moins de 100ms sur un jeu de données réel.

```

```

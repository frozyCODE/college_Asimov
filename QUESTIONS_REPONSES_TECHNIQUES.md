# 🎓 Préparation Technique : Questions & Réponses - Projet Asim'UT

Ce document contient les questions les plus probables lors d'une revue de code ou d'un examen, avec des réponses détaillées pour prouver ta maîtrise du sujet.

---

## 🏗️ Architecture & Structure

### Q1 : Pourquoi avoir choisi l'architecture MVC ?

**Réponse :** L'architecture **MVC (Modèle-Vue-Contrôleur)** permet une séparation stricte des responsabilités :

- **Le Modèle** gère la logique de données et les requêtes SQL.
- **La Vue** (EJS ou JavaFX) s'occupe de l'affichage.
- **Le Contrôleur** fait le lien, traite la logique métier et les requêtes HTTP.
  _Avantage :_ Cela rend le code plus facile à maintenir, à tester et à faire évoluer sans tout casser.

### Q2 : Pourquoi séparer la table `Utilisateurs` de la table `Eleves` ou `Professeurs` ?

**Réponse :** C'est un principe de **normalisation**. Tous les acteurs (élèves, profs, parents) partagent des propriétés communes (nom, prénom, email, mot de passe). En créant une table `Utilisateurs` centrale, on évite la duplication de code et de données. Les tables spécifiques (`Eleves`, `Professeurs`) contiennent uniquement les infos propres à leur rôle, reliées par une **Clé Étrangère** (`utilisateur_id`).

---

## 🔐 Sécurité & Authentification

### Q3 : Comment fonctionne ton système d'authentification ?

**Réponse :** J'utilise des **JWT (JSON Web Tokens)**.

1. L'utilisateur envoie ses identifiants.
2. Le serveur vérifie le mot de passe (haché avec **bcrypt**).
3. Si c'est bon, le serveur génère un jeton signé.
4. Ce jeton est renvoyé au client qui doit le présenter dans le header `Authorization` à chaque requête suivante pour prouver son identité.

### Q4 : À quoi sert ton middleware `autoriserRoles` ?

**Réponse :** C'est du **RBAC (Role-Based Access Control)**. C'est une fonction qui s'exécute avant le contrôleur pour vérifier si l'utilisateur a le bon rôle (ex: seul un 'Proviseur' peut valider une moyenne). Si le rôle ne correspond pas, on renvoie une erreur 403 (Forbidden), protégeant ainsi les routes sensibles.

---

## 💾 Base de Données & SQL

### Q5 : C'est quoi une "Transaction SQL" et pourquoi l'utilises-tu dans `EleveModel.create` ?

**Réponse :** Une transaction garantit l'**Atomicité** (le 'A' de ACID).
Lorsqu'on crée un élève, on doit d'abord créer son compte dans `Utilisateurs` puis son profil dans `Eleves`.
Si la deuxième étape échoue (ex: erreur réseau), la transaction fait un **Rollback** pour annuler la première étape. Sans cela, on se retrouverait avec un utilisateur "fantôme" sans profil associé.

### Q6 : Pourquoi utiliser des requêtes préparées (`?`) au lieu de concaténer les chaînes ?

**Réponse :** Pour prévenir les **Injections SQL**. Les requêtes préparées séparent la structure de la requête des données. Le moteur SQL traite les données comme du texte pur, et non comme du code exécutable, ce qui rend impossible pour un pirate de manipuler ma base de données via un formulaire.

---

## 🌐 Communication API & Asynchronisme

### Q7 : Pourquoi utiliser `async/await` en Node.js et `CompletableFuture` en Java ?

**Réponse :** Pour ne pas bloquer le **Thread principal**.

- En Node.js, cela permet au serveur de traiter d'autres requêtes pendant qu'il attend la réponse de la base de données.
- En JavaFX, cela permet de faire l'appel API en tâche de fond pour que l'interface utilisateur (UI) ne se fige pas pendant le chargement.

### Q8 : Comment ton client JavaFX communique-t-il avec ton API Node.js ?

**Réponse :** Le client Java utilise un `ApiClient` qui envoie des requêtes HTTP (GET, POST, etc.) vers les URLs de l'API. Les données sont échangées au format **JSON**. J'utilise la bibliothèque **Jackson** pour transformer automatiquement ce JSON en objets Java (POJO).

---

## 🛠️ Qualité de Code

### Q9 : C'est quoi `AppError` et pourquoi ne pas juste utiliser `res.status(500)` ?

**Réponse :** `AppError` est une classe personnalisée qui me permet de centraliser la gestion des erreurs. Je peux définir un message clair et un code HTTP spécifique. Cela permet d'avoir un format de réponse d'erreur uniforme pour le frontend, facilitant le débogage.

### Q10 : À quoi sert le `express-validator` dans tes routes ?

**Réponse :** C'est une première ligne de défense. Elle vérifie que les données sont au bon format (ex: email valide, mot de passe assez long) _avant_ même que la logique métier ne commence. Cela évite les bugs et renforce la sécurité.

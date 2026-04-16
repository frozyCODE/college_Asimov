# Guide de Développement Client Java - API Asimov

Ce document définit la stratégie d'implémentation et fournit des exemples techniques pour le développement d'un logiciel client Java consommant l'API REST Asimov.

## 1. Roadmap de Développement

### Phase 1 : Configuration du projet
- Utilisation de Java 17 ou version supérieure.
- Gestionnaire de dépendances : Maven ou Gradle.
- Bibliothèques recommandées :
    - Jackson (FasterXML) : Pour le mapping JSON/Objet.
    - JUnit 5 : Pour les tests unitaires.

### Phase 2 : Architecture de la couche réseau
- Implémentation d'un client HTTP singleton basé sur `java.net.http.HttpClient`.
- Gestion de la persistance du jeton JWT après authentification.
- Création d'un intercepteur ou d'une méthode utilitaire pour injecter systématiquement le header `Authorization: Bearer <token>`.

### Phase 3 : Modélisation des données (POJO)
- Création des classes Java correspondant aux schémas de l'API (Eleve, Professeur, Inscription, Moyenne, etc.).
- Utilisation de bibliothèques comme Lombok pour réduire le code boilerplate (getters/setters).

### Phase 4 : Services métier
- Séparation des responsabilités par module (EleveService, AuthService, StageService).
- Chaque service gère les requêtes HTTP spécifiques et la désérialisation des réponses.

### Phase 5 : Interface Utilisateur
- Framework recommandé : JavaFX pour une interface moderne et stylisable par CSS.
- Implémentation du pattern MVC (Modèle-Vue-Contrôleur) ou MVVM.

## 2. Exemple d'implémentation technique

L'exemple suivant illustre la structure d'un client de base pour s'authentifier et récupérer des données.

### A. Classe de configuration du client API

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class AsimovApiClient {
    private static final String BASE_URL = "http://localhost:3000/api";
    private final HttpClient httpClient;
    private String jwtToken;

    public AsimovApiClient() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    /**
     * Authentification et stockage du token JWT
     */
    public boolean login(String email, String password) throws Exception {
        String jsonBody = String.format("{\"email\":\"%s\", \"password\":\"%s\"}", email, password);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/auth/login"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            // Ici, extraire le token du JSON (ex: via Jackson)
            // this.jwtToken = extractToken(response.body());
            return true;
        }
        return false;
    }

    /**
     * Exemple de récupération des élèves
     */
    public String getEleves() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/eleves"))
                .header("Authorization", "Bearer " + this.jwtToken)
                .GET()
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }
}
```

### B. Gestion de la désérialisation JSON (Jackson)

Pour transformer le JSON reçu en objets Java, l'approche standard est la suivante :

```java
ObjectMapper mapper = new ObjectMapper();
// Pour un seul objet
Eleve eleve = mapper.readValue(jsonString, Eleve.class);
// Pour une liste d'objets
List<Eleve> eleves = mapper.readValue(jsonString, new TypeReference<List<Eleve>>(){});
```

## 3. Recommandations de sécurité
- Ne jamais stocker le mot de passe utilisateur en clair dans l'application Java après l'authentification.
- Utiliser le stockage sécurisé du système d'exploitation pour conserver le jeton JWT si une fonction "Se souvenir de moi" est implémentée.
- Toujours valider les données côté Java avant de les envoyer à l'API pour réduire la charge réseau.

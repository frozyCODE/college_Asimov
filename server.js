const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

/**
 * @module server
 * @description Point d'entrée principal de l'API Asim'UT. Configure les middlewares globaux, les routes et la gestion d'erreurs.
 */

// --- Vérification des variables d'environnement obligatoires ---
const requiredEnvVars = [
  "PORT",
  "JWT_SECRET",
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
];
requiredEnvVars.forEach((varName) => {
  if (process.env[varName] === undefined) {
    console.error(`❌ Variable d'environnement manquante : ${varName}`);
    process.exit(1);
  }
});

const eleveRoutes = require("./routes/eleveRoutes");
const professeurRoutes = require("./routes/professeurRoutes");
const authRoutes = require("./routes/authRoutes");
const stageRoutes = require("./routes/stageRoutes");
const inscriptionRoutes = require("./routes/inscriptionRoutes");
const moyenneRoutes = require("./routes/moyenneRoutes");
const optionRoutes = require("./routes/optionRoutes");
const parentRoutes = require("./routes/parentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const webRoutes = require("./routes/webRoutes");
const { globalErrorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// --- Moteur de templates EJS ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --- Fichiers statiques (CSS, JS client) ---
app.use(express.static(path.join(__dirname, "public")));

// --- Sécurité & Logging ---
app.use(helmet({ contentSecurityPolicy: false })); // CSP désactivé pour autoriser les styles/scripts inline EJS
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Pour les formulaires HTML POST

// --- Session (authentification EJS) ---
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Passer à true en production avec HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 24h
  },
}));

// --- Injection automatique du token JWT de session dans les appels /api/ ---
// Les pages EJS font des fetch() vers /api/* ; ce middleware injecte
// le token stocké dans la session dans l'en-tête Authorization.
app.use("/api", (req, res, next) => {
  if (
    req.session &&
    req.session.utilisateur &&
    req.session.utilisateur.token &&
    !req.headers["authorization"]
  ) {
    req.headers["authorization"] = `Bearer ${req.session.utilisateur.token}`;
  }
  next();
});

// --- Rate Limiting sur l'authentification ---
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
  },
});

// --- Routes API ---
app.use("/api/auth", loginLimiter, authRoutes);
app.use("/api/eleves", eleveRoutes);
app.use("/api/professeurs", professeurRoutes);
app.use("/api/stages", stageRoutes);
app.use("/api/inscriptions", inscriptionRoutes);
app.use("/api/moyennes", moyenneRoutes);
app.use("/api/options", optionRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/admin", adminRoutes);

// --- Routes Web (EJS) ---
app.use("/", webRoutes);

// --- Middleware global de gestion des erreurs (doit être en DERNIER) ---
app.use(globalErrorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(
    `Serveur Asim'UT démarré avec succès sur http://localhost:${PORT}`,
  );
});

module.exports = app; // Exporté pour les tests Jest

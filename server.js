const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
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
const { globalErrorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// --- Sécurité & Logging ---
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

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

// --- Routes ---
app.use("/api/auth", loginLimiter, authRoutes);
app.use("/api/eleves", eleveRoutes);
app.use("/api/professeurs", professeurRoutes);
app.use("/api/stages", stageRoutes);
app.use("/api/inscriptions", inscriptionRoutes);
app.use("/api/moyennes", moyenneRoutes);
app.use("/api/options", optionRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/admin", adminRoutes);

// --- Middleware global de gestion des erreurs (doit être en DERNIER) ---
app.use(globalErrorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(
    `Serveur Asim'UT démarré avec succès sur http://localhost:${PORT}`,
  );
});

module.exports = app; // Exporté pour les tests Jest

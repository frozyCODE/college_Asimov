const express = require("express");
const router  = express.Router();
const webController = require("../controllers/webController");

/**
 * @module routes/webRoutes
 * @description Routes pour l'interface EJS (vues serveur-rendues).
 * Ces routes gèrent la navigation côté client avec authentification par session.
 */

/* ─── Pages publiques ────────────────────── */
router.get("/login", webController.getLogin);
router.post("/login", webController.postLogin);
router.post("/logout", webController.logout);
router.get("/projet-asimov", webController.getAsimov);

/* ─── Pages protégées ────────────────────── */
router.get("/", webController.requireSession, webController.getDashboard);
router.get("/dashboard", webController.requireSession, webController.getDashboard);
router.get("/eleves", webController.requireSession, webController.getEleves);
router.get("/moyennes", webController.requireSession, webController.getMoyennes);
router.get("/options", webController.requireSession, webController.getOptions);
router.get("/classes", webController.requireSession, webController.getClasses);
router.get("/inscriptions", webController.requireSession, webController.getInscriptions);
router.get("/espace-eleve", webController.requireSession, webController.getMonEspace);

module.exports = router;

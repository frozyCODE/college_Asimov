const Utilisateur = require("../models/userModel");
const Classe      = require("../models/ClasseModel");
const Eleve       = require("../models/EleveModel");
const Inscription = require("../models/InscriptionModel");
const Moyenne     = require("../models/MoyenneModel");
const Parent      = require("../models/ParentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @module controllers/webController
 * @description Contrôleur gérant les vues EJS (interface utilisateur web).
 * Utilise express-session pour persister l'authentification côté serveur.
 */

/* ======================================================
   MIDDLEWARE — Protection des routes EJS
   ====================================================== */

/**
 * Vérifie qu'une session utilisateur est active. Redirige vers /login si non connecté.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const requireSession = (req, res, next) => {
  if (!req.session || !req.session.utilisateur) {
    return res.redirect("/login");
  }
  next();
};

/* ======================================================
   AUTHENTIFICATION
   ====================================================== */

/**
 * Affiche le formulaire de connexion.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
const getLogin = (req, res) => {
  if (req.session && req.session.utilisateur) {
    return res.redirect("/dashboard");
  }
  res.render("pages/login", {
    title: "Connexion",
    error: req.session.loginError || null,
    email: req.session.loginEmail || "",
  });
  delete req.session.loginError;
  delete req.session.loginEmail;
};

/**
 * Traite la soumission du formulaire de connexion.
 * Authentifie l'utilisateur contre la BDD et crée une session.
 *
 * @async
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
const postLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(`[LOGIN ATTEMPT] Email: "${email}", Password: "${password}"`);

  try {
    if (!email || !password) {
      console.log(`[LOGIN FAILED] Missing email or password`);
      req.session.loginError = "Email et mot de passe obligatoires.";
      req.session.loginEmail = email || "";
      return res.redirect("/login");
    }

    const user = await Utilisateur.findByEmail(email);

    if (!user) {
      console.log(`[LOGIN FAILED] No user found for email: ${email}`);
      req.session.loginError = "Email ou mot de passe incorrect.";
      req.session.loginEmail = email;
      return res.redirect("/login");
    }

    console.log(
      `[LOGIN INFO] User found: ${user.nom} ${user.prenom} (Role: ${user.role})`,
    );
    console.log(`[LOGIN INFO] Hash in DB: ${user.password_hash}`);

    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log(`[LOGIN INFO] bcrypt.compare result: ${isMatch}`);

    if (!isMatch) {
      console.log(`[LOGIN FAILED] Password mismatch for ${email}`);
      req.session.loginError = "Email ou mot de passe incorrect.";
      req.session.loginEmail = email;
      return res.redirect("/login");
    }

    // Génération du token JWT (utilisé ensuite par les requêtes fetch côté client)
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
    );

    // Stockage session
    req.session.utilisateur = {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      token, // transmis aux pages pour les appels fetch
    };

    console.log(
      `[LOGIN SUCCESS] ${email} connected successfully! Redirecting to dashboard.`,
    );
    res.redirect("/dashboard");
  } catch (err) {
    console.error("[webController.postLogin] ERROR:", err);
    req.session.loginError = "Une erreur est survenue. Veuillez réessayer.";
    res.redirect("/login");
  }
};

/**
 * Déconnecte l'utilisateur en détruisant la session.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

/* ======================================================
   PAGES PROTÉGÉES
   ====================================================== */

/** Tableau de bord */
const getDashboard = (req, res) => {
  res.render("pages/dashboard", { utilisateur: req.session.utilisateur });
};

/** Page gestion des élèves */
const getEleves = (req, res) => {
  const { role } = req.session.utilisateur;
  if (!["Professeur", "Secretariat", "Proviseur"].includes(role)) {
    return res.redirect("/dashboard");
  }
  res.render("pages/eleves", { utilisateur: req.session.utilisateur });
};

/** Page moyennes */
const getMoyennes = (req, res) => {
  res.render("pages/moyennes", { utilisateur: req.session.utilisateur });
};

/** Page options */
const getOptions = (req, res) => {
  const { role } = req.session.utilisateur;
  if (!["Secretariat", "Proviseur"].includes(role)) {
    return res.redirect("/dashboard");
  }
  res.render("pages/options", { utilisateur: req.session.utilisateur });
};

/** Page classes management */
const getClasses = async (req, res) => {
  const { role } = req.session.utilisateur;
  if (!["Professeur", "Secretariat", "Proviseur"].includes(role)) {
    return res.redirect("/dashboard");
  }
  try {
    const classes = await Classe.findAll();
    const eleves = await Eleve.getAll();
    res.render("pages/classes", {
      utilisateur: req.session.utilisateur,
      classes,
      eleves,
    });
  } catch (err) {
    console.error(err);
    res.render("pages/classes", {
      utilisateur: req.session.utilisateur,
      classes: [],
      eleves: [],
    });
  }
};

/** Page inscriptions */
const getInscriptions = (req, res) => {
  const { role } = req.session.utilisateur;
  if (!["Professeur", "Secretariat", "Proviseur"].includes(role)) {
    return res.redirect("/dashboard");
  }
  res.render("pages/inscriptions", { utilisateur: req.session.utilisateur });
};

/** Page présentation du Projet Asimov */
const getAsimov = (req, res) => {
  res.render("pages/projet_asimov", {
    utilisateur: req.session.utilisateur,
    title: "Le Projet Asimov",
  });
};

/** Page Espace personnel élève */
const getMonEspace = async (req, res) => {
  try {
    const { id: utilisateurId, role } = req.session.utilisateur;
    if (role !== "Eleve") return res.redirect("/dashboard");

    console.log("DEBUG - Eleve object:", Eleve);
    console.log("DEBUG - Type of findByUtilisateurId:", typeof Eleve.findByUtilisateurId);
    const profil = await Eleve.findByUtilisateurId(utilisateurId);
    if (!profil) {
      return res.status(404).send("Profil élève introuvable");
    }

    const [inscriptions, parents] = await Promise.all([
      Inscription.findByEleve(profil.id),
      Parent.getParentsByEleve(profil.id),
    ]);

    const dossier = await Promise.all(
      inscriptions.map(async (ins) => {
        const notes = await Moyenne.findByInscription(ins.id);
        return { ...ins, notes };
      }),
    );

    res.render("pages/mon-espace", {
      utilisateur: req.session.utilisateur,
      profil,
      dossier,
      parents,
      title: "Mon Espace",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors du chargement de l'espace élève");
  }
};

module.exports = {
  requireSession,
  getLogin,
  postLogin,
  logout,
  getDashboard,
  getEleves,
  getMoyennes,
  getOptions,
  getClasses,
  getInscriptions,
  getAsimov,
  getMonEspace,
};

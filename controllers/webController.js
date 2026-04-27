const Utilisateur = require("../models/userModel");
const Classe = require("../models/ClasseModel");
const Eleve = require("../models/EleveModel");
const Inscription = require("../models/InscriptionModel");
const Moyenne = require("../models/MoyenneModel");
const Parent = require("../models/ParentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Vérifie qu'une session utilisateur est active.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const requireSession = (req, res, next) => {
  if (!req.session || !req.session.utilisateur) {
    return res.redirect("/login");
  }
  next();
};

/**
 * Affiche la page de connexion.
 *
 * @param {import('express').Request} req
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
 * Traite la connexion utilisateur.
 *
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      req.session.loginError = "Email et mot de passe obligatoires.";
      req.session.loginEmail = email || "";
      return res.redirect("/login");
    }

    const user = await Utilisateur.findByEmail(email);

    if (!user) {
      req.session.loginError = "Email ou mot de passe incorrect.";
      req.session.loginEmail = email;
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      req.session.loginError = "Email ou mot de passe incorrect.";
      req.session.loginEmail = email;
      return res.redirect("/login");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
    );

    req.session.utilisateur = {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      token,
    };

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    req.session.loginError = "Une erreur est survenue.";
    res.redirect("/login");
  }
};

/**
 * Déconnecte l'utilisateur.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

/** Affiche le tableau de bord. */
const getDashboard = (req, res) => {
  res.render("pages/dashboard", { utilisateur: req.session.utilisateur });
};

/** Affiche la gestion des élèves. */
const getEleves = (req, res) => {
  const { role } = req.session.utilisateur;
  if (!["Professeur", "Secretariat", "Proviseur"].includes(role)) {
    return res.redirect("/dashboard");
  }
  res.render("pages/eleves", { utilisateur: req.session.utilisateur });
};

/** Affiche la gestion des moyennes. */
const getMoyennes = (req, res) => {
  res.render("pages/moyennes", { utilisateur: req.session.utilisateur });
};

/** Affiche la gestion des options. */
const getOptions = (req, res) => {
  const { role } = req.session.utilisateur;
  if (!["Secretariat", "Proviseur"].includes(role)) {
    return res.redirect("/dashboard");
  }
  res.render("pages/options", { utilisateur: req.session.utilisateur });
};

/** Affiche la gestion des classes. */
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
    res.render("pages/classes", {
      utilisateur: req.session.utilisateur,
      classes: [],
      eleves: [],
    });
  }
};

/** Affiche la gestion des inscriptions. */
const getInscriptions = (req, res) => {
  const { role } = req.session.utilisateur;
  if (!["Professeur", "Secretariat", "Proviseur"].includes(role)) {
    return res.redirect("/dashboard");
  }
  res.render("pages/inscriptions", { utilisateur: req.session.utilisateur });
};

/** Affiche la page Projet Asimov. */
const getAsimov = (req, res) => {
  res.render("pages/projet_asimov", {
    utilisateur: req.session.utilisateur,
    title: "Le Projet Asimov",
  });
};

/** Affiche l'espace personnel de l'élève. */
const getMonEspace = async (req, res) => {
  try {
    const { id: utilisateurId, role } = req.session.utilisateur;
    if (role !== "Eleve") return res.redirect("/dashboard");

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
    res.status(500).send("Erreur serveur.");
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

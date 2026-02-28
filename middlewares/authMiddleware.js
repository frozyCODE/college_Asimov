const jwt = require("jsonwebtoken");

/**
 * Middleware pour protéger les routes.
 * Vérifie la présence et la validité du token JWT dans le header Authorization.
 */
const verifierToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Accès refusé. Token manquant." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token invalide ou expiré." });
  }
};

/**
 * Middleware pour filtrer l'accès selon le rôle de l'utilisateur.
 *
 * @param {...string} rolesAutorises - Liste des rôles autorisés (ex: 'Proviseur', 'Secretariat').
 */
const autoriserRoles = (...rolesAutorises) => {
  return (req, res, next) => {
    if (!rolesAutorises.includes(req.user.role)) {
      return res.status(403).json({
        message:
          "Accès interdit. Votre rôle (" +
          req.user.role +
          ") ne permet pas d'effectuer cette action.",
      });
    }
    next();
  };
};

module.exports = { verifierToken, autoriserRoles };

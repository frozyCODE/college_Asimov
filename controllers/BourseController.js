const BourseModel = require("../models/BourseModel");
const EleveModel = require("../models/EleveModel");
const AppError = require("../utils/appError");

/**
 * Soumettre une demande de bourse (Pour l'élève)
 */
const demanderBourse = async (req, res, next) => {
  try {
    const utilisateurId = req.user.id;

    // Trouver l'élève correspondant
    const eleve = await EleveModel.findByUtilisateurId(utilisateurId);
    if (!eleve) {
      throw new AppError(
        "Seul un élève peut faire une demande de bourse.",
        403,
      );
    }

    // Vérifier s'il a déjà une demande
    const demandeExistante = await BourseModel.getDemandeByEleve(eleve.id);
    if (demandeExistante) {
      throw new AppError(
        "Vous avez déjà une demande en cours ou traitée.",
        400,
      );
    }

    await BourseModel.creerDemande(eleve.id);

    res.status(201).json({ message: "Demande de bourse envoyée avec succès." });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer la demande de l'élève connecté
 */
const getMaDemande = async (req, res, next) => {
  try {
    const utilisateurId = req.user.id;
    const eleve = await EleveModel.findByUtilisateurId(utilisateurId);

    if (!eleve) {
      throw new AppError("Profil élève introuvable.", 404);
    }

    const demande = await BourseModel.getDemandeByEleve(eleve.id);
    res.status(200).json({ data: demande }); // renvoie "null" s'il n'y a pas de demande
  } catch (error) {
    next(error);
  }
};

/**
 * Lister toutes les demandes (Pour le secrétariat/proviseur)
 */
const listerDemandes = async (req, res, next) => {
  try {
    const demandes = await BourseModel.getAllDemandes();
    res.status(200).json({ data: demandes });
  } catch (error) {
    next(error);
  }
};

/**
 * Traiter (Accepter/Refuser) une demande (Pour le secrétariat/proviseur)
 */
const traiterDemande = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // on attend "Accepter" ou "Refuser" dans le body
    const validateurId = req.user.id;

    if (action !== "Accepter" && action !== "Refuser") {
      throw new AppError(
        "Action invalide (doit être 'Accepter' ou 'Refuser').",
        400,
      );
    }

    const statut = action === "Accepter" ? "Acceptée" : "Refusée";

    const updated = await BourseModel.updateStatut(id, statut, validateurId);
    if (!updated) {
      throw new AppError("Demande introuvable.", 404);
    }

    res
      .status(200)
      .json({ message: `La demande a été ${statut.toLowerCase()}.` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  demanderBourse,
  getMaDemande,
  listerDemandes,
  traiterDemande,
};

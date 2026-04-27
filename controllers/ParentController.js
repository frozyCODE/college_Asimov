const Parent = require("../models/ParentModel");
const response = require("../utils/responseHelper");
const AppError = require("../utils/appError");

/**
 * Récupère la liste complète des parents.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const getParents = async (req, res, next) => {
  try {
    const liste = await Parent.getAll();
    return response.success(res, 200, "Liste des parents récupérée.", liste);
  } catch (error) {
    next(error);
  }
};

/**
 * Crée un nouveau compte Parent.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const addParent = async (req, res, next) => {
  try {
    const id = await Parent.create(req.body);
    return response.success(res, 201, "Parent créé avec succès !", { id });
  } catch (error) {
    next(error);
  }
};

/**
 * Associe un parent à un élève.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const lierEleve = async (req, res, next) => {
  try {
    const { eleve_id, parent_id } = req.body;
    await Parent.linkToEleve(eleve_id, parent_id);
    return response.success(res, 201, "Lien parent-élève créé avec succès !");
  } catch (error) {
    next(error);
  }
};

/**
 * Liste les élèves associés à un parent.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const getMesEleves = async (req, res, next) => {
  try {
    const { parent_id } = req.params;
    const eleves = await Parent.getElevesByParent(parent_id);
    return response.success(res, 200, "Enfants récupérés avec succès.", eleves);
  } catch (error) {
    next(error);
  }
};

module.exports = { getParents, addParent, lierEleve, getMesEleves };


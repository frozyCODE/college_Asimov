/**
 * @module utils/responseHelper
 * @description Fonctions utilitaires pour standardiser les réponses API.
 */

/**
 * Envoie une réponse JSON de succès standardisée.
 * 
 * @function success
 * @param {import('express').Response} res - L'objet réponse Express.
 * @param {number} statusCode - Le code HTTP de succès (ex: 200, 201).
 * @param {string} message - Un message descriptif du succès.
 * @param {*} [data] - Les données optionnelles à renvoyer au client.
 * @returns {import('express').Response} La réponse envoyée.
 */
const success = (res, statusCode, message, data = undefined) => {
  const body = { success: true, message };
  if (data !== undefined) body.data = data;
  return res.status(statusCode).json(body);
};

/**
 * Envoie une réponse JSON d'erreur standardisée (utilisé hors middleware global si nécessaire).
 * 
 * @function error
 * @param {import('express').Response} res - L'objet réponse Express.
 * @param {number} statusCode - Le code HTTP d'erreur (ex: 400, 404, 500).
 * @param {string} message - Le message d'erreur.
 * @param {*} [detail] - Détails techniques (masqués en production).
 * @returns {import('express').Response} La réponse envoyée.
 */
const error = (res, statusCode, message, detail = undefined) => {
  const body = { success: false, message };
  if (detail !== undefined && process.env.NODE_ENV !== "production") {
    body.detail = detail;
  }
  return res.status(statusCode).json(body);
};

module.exports = { success, error };

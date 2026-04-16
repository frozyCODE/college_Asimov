/**
 * @module utils/appError
 * @description Classe personnalisée pour gérer les erreurs opérationnelles de l'application.
 */

/**
 * @class AppError
 * @extends Error
 * @description Permet de spécifier un code de statut HTTP et de marquer l'erreur comme opérationnelle pour le traitement global.
 */
class AppError extends Error {
  /**
   * Crée une instance d'AppError.
   * 
   * @param {string} message - Le message d'erreur explicatif.
   * @param {number} statusCode - Le code de statut HTTP (ex: 404, 400).
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

const AppError = require("../utils/appError");

/**
 * @module middlewares/errorMiddleware
 * @description Middleware de gestion des erreurs globales. Capture toutes les erreurs transmises via next(error).
 */

/**
 * Traite les erreurs capturées par Express et renvoie une réponse JSON standardisée.
 * Doit être enregistré EN DERNIER dans server.js (après toutes les routes).
 *
 * @function globalErrorHandler
 * @param {Error|AppError} err - L'erreur capturée.
 * @param {import('express').Request} req - L'objet requête Express.
 * @param {import('express').Response} res - L'objet réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {void}
 */
const globalErrorHandler = (err, req, res, next) => {
  console.error(`[ERREUR] ${new Date().toISOString()} - ${err.message}`);
  
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  // Gestion des erreurs de clé dupliquée MySQL (ex: email déjà pris)
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      status: "fail",
      message: "Cette ressource existe déjà (doublon détecté).",
    });
  }

  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message || "Une erreur interne est survenue.";

  res.status(statusCode).json({
    success: false,
    status: status,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = { globalErrorHandler };

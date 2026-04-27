const AppError = require("../utils/appError");

/**
 * Gestionnaire d'erreurs global pour l'application.
 * 
 * @param {Error|AppError} err 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const globalErrorHandler = (err, req, res, next) => {
  console.error(`[ERREUR] ${new Date().toISOString()} - ${err.message}`);
  
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

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


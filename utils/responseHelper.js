/**
 * Envoie une réponse de succès JSON standardisée.
 * 
 * @param {import('express').Response} res 
 * @param {number} statusCode 
 * @param {string} message 
 * @param {*} [data] 
 * @returns {import('express').Response}
 */
const success = (res, statusCode, message, data = undefined) => {
  const body = { success: true, message };
  if (data !== undefined) body.data = data;
  return res.status(statusCode).json(body);
};

/**
 * Envoie une réponse d'erreur JSON standardisée.
 * 
 * @param {import('express').Response} res 
 * @param {number} statusCode 
 * @param {string} message 
 * @param {*} [detail] 
 * @returns {import('express').Response}
 */
const error = (res, statusCode, message, detail = undefined) => {
  const body = { success: false, message };
  if (detail !== undefined && process.env.NODE_ENV !== "production") {
    body.detail = detail;
  }
  return res.status(statusCode).json(body);
};

module.exports = { success, error };


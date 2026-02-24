const Utilisateur = require('../models/userModel');
const bcrypt = require('bcrypt');

/**
 * Gère la connexion d'un utilisateur (Élève, Professeur, etc.).
 * Vérifie l'email et le mot de passe, et renvoie les informations de l'utilisateur si la connexion réussit.
 * 
 * @param {Object} req - L'objet requête Express, contenant l'email et le mot de passe dans `req.body`.
 * @param {Object} res - L'objet réponse Express.
 * @returns {Promise<void>} Renvoie un objet JSON avec les informations de l'utilisateur (code 200). Erreur code 401 si identifiants incorrects, ou 500 en cas d'erreur serveur.
 */
const login = async (req, res) => {
    try {
        // 1. On récupère l'email et le mot de passe envoyés par l'utilisateur
        const email = req.body.email;
        const password = req.body.password;

        // 2. On cherche si cet email existe dans la base de données
        const user = await Utilisateur.findByEmail(email);
        
        if (!user) {
            // ERREUR 401 : Non Autorisé. 
            // Règle de sécurité : on ne dit jamais "L'email n'existe pas", on dit "Email ou mot de passe incorrect" pour bloquer les hackers.
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        // 3. On compare le mot de passe tapé avec le hash de la BDD
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (isMatch == false) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        // 4. Si tout est bon, on connecte l'utilisateur !
        // On renvoie ses infos (SAUF son mot de passe, c'est privé)
        res.status(200).json({
            message: "Connexion réussie !",
            utilisateur: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la tentative de connexion", detail: error.message });
    }
};

module.exports = {
    login
};
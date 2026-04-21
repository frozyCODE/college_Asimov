const db = require('./db');
const bcrypt = require('bcrypt');

async function resetAllPasswords() {
    try {
        const passwordToSet = 'email'; // Le mot de passe pour tous les comptes
        console.log(`Génération du hash pour le mot de passe : "${passwordToSet}"...`);
        
        // 1. On génère le hash avec l'outil exact du projet
        const saltRounds = 10;
        const hash = await bcrypt.hash(passwordToSet, saltRounds);
        console.log(`Nouveau hash généré : ${hash}`);
        
        // 2. On met à jour tous les utilisateurs dans la BDD
        const [result] = await db.execute(
            'UPDATE Utilisateurs SET password_hash = ?',
            [hash]
        );
        
        console.log(`✅ Succès ! Le mot de passe de ${result.affectedRows} utilisateurs a été mis à jour avec le mot de passe "${passwordToSet}".`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour des mots de passe :', error);
        process.exit(1);
    }
}

resetAllPasswords();

const bcrypt = require("bcrypt");
const db = require("./config/db");

async function checkAndCreateFirstAdmin() {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM Utilisateurs WHERE role = 'Proviseur'",
    );

    if (rows.length > 0) {
      console.log("✅ L'application contient déjà au moins un Proviseur.");
      process.exit(0);
    }

    console.log(
      "⚙️ Aucun Proviseur détecté. Création du compte administrateur par défaut...",
    );

    const nom = "Admin";
    const prenom = "Proviseur";
    const email = "proviseur@college.fr";
    const password = "admin"; // Mot de passe par défaut

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      `INSERT INTO Utilisateurs (nom, prenom, email, password_hash, role) VALUES (?, ?, ?, ?, 'Proviseur')`,
      [nom, prenom, email, hashedPassword],
    );

    console.log("🎉 Compte Proviseur créé avec succès !");
    console.log(`✉️  Email : ${email}`);
    console.log(`🔑 Mot de passe : ${password}`);
    console.log("⚠️ N'oublie pas de changer ce mot de passe en production !");
  } catch (error) {
    console.error(
      "❌ Erreur lors de la création du compte administrateur :",
      error,
    );
  } finally {
    process.exit(0);
  }
}

checkAndCreateFirstAdmin();

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); 

// Route de test
app.get('/api', (req, res) => {
    res.json({ message: "Bienvenue sur l'API Asim'UT !" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Accès à l'API : http://localhost:${PORT}/api`);
});
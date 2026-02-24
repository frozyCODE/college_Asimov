const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors()); 

app.use(express.json()); 

const eleveRoutes = require('./routes/eleveRoutes');
const professeurRoutes = require('./routes/professeurRoutes');

app.use('/api/eleves', eleveRoutes);
app.use('/api/professeurs', professeurRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Serveur Asim'UT démarré avec succès sur http://localhost:${PORT}`);
    console.log(`Routes Élèves disponibles sur http://localhost:${PORT}/api/eleves`);
    console.log(`Routes Professeurs disponibles sur http://localhost:${PORT}/api/professeurs`);
});
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors()); 

app.use(express.json()); 

const eleveRoutes = require('./routes/eleveRoutes');

app.use('/api/eleves', eleveRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Serveur Asim'UT démarré avec succès sur http://localhost:${PORT}`);
    console.log(`Routes Élèves disponibles sur http://localhost:${PORT}/api/eleves`);
});
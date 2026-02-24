const express = require('express');
const cors = require('cors');
const eleveRoutes = require('./routes/eleveRoutes');
const professeurRoutes = require('./routes/professeurRoutes');
const authRoutes = require('./routes/authRoutes');
const stageRoutes = require('./routes/stageRoutes');
const app = express();


require('dotenv').config();
app.use(cors()); 
app.use(express.json()); 

app.use('/api/eleves', eleveRoutes);
app.use('/api/professeurs', professeurRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stages', stageRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Serveur Asim'UT démarré avec succès sur http://localhost:${PORT}`);
    console.log(`Routes Élèves disponibles sur http://localhost:${PORT}/api/eleves`);
    console.log(`Routes Professeurs disponibles sur http://localhost:${PORT}/api/professeurs`);
    console.log(`Routes Auth disponibles sur http://localhost:${PORT}/api/auth`);
});
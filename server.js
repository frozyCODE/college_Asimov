const express = require('express');
const cors = require('cors');
const eleveRoutes = require('./routes/eleveRoutes');
const professeurRoutes = require('./routes/professeurRoutes');
const authRoutes = require('./routes/authRoutes');
const stageRoutes = require('./routes/stageRoutes');
const inscriptionRoutes = require('./routes/inscriptionRoutes');
const app = express();


require('dotenv').config();
app.use(cors()); 
app.use(express.json()); 

app.use('/api/eleves', eleveRoutes);
app.use('/api/professeurs', professeurRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stages', stageRoutes);
app.use('/api/inscriptions', inscriptionRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Serveur Asim'UT démarré avec succès sur http://localhost:${PORT}`);
});
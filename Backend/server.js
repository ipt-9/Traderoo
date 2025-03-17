require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database'); // MySQL-Verbindung
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// API-Routen direkt verwenden
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Server starten
app.listen(5000, () => {
    console.log('Server läuft auf Port 5000');
});

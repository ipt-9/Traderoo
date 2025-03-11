const express = require('express');
const router = express.Router();
const db = require('../database');
const jwt = require('jsonwebtoken');

// Benutzerprofil abrufen
router.get('/profile', (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, message: "Kein Token vorhanden!" });
    }

    try {
        const decoded = jwt.verify(token, 'geheimes_token');
        db.query('SELECT Username, Email FROM Users WHERE Username = ?', [decoded.username], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: "Datenbankfehler!" });

            if (results.length === 0) {
                return res.status(404).json({ success: false, message: "Benutzer nicht gefunden!" });
            }

            res.json({ success: true, user: results[0] });
        });
    } catch (error) {
        res.status(401).json({ success: false, message: "Ungültiges Token!" });
    }
});

module.exports = router;

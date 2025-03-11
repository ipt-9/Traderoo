const express = require("express");
const router = express.Router();
const db = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Registrierung eines neuen Benutzers
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    // Prüfen, ob der Benutzer bereits existiert
    db.query("SELECT * FROM Users WHERE Email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Datenbankfehler!" });

        if (results.length > 0) {
            return res.status(400).json({ success: false, message: "E-Mail bereits registriert!" });
        }

        // Passwort hashen
        const hashedPassword = await bcrypt.hash(password, 10);

        // Token generieren
        const token = jwt.sign({ username, email }, "geheimes_token", { expiresIn: "1h" });

        // Benutzer speichern
        db.query(
            "INSERT INTO Users (Username, Email, Password, Token) VALUES (?, ?, ?, ?)",
            [username, email, hashedPassword, token],
            (err, result) => {
                if (err) return res.status(500).json({ success: false, message: "Fehler beim Speichern in der Datenbank!" });

                res.json({ success: true, message: "Registrierung erfolgreich!", token });
            }
        );
    });
});

module.exports = router;

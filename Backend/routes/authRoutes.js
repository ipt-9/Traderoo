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
        console.log("Generated Token:", token);  // Debugging

        // Benutzer speichern
        db.query(
            "INSERT INTO Users (Username, Email, Password, Token) VALUES (?, ?, ?, ?)",
            [username, email, hashedPassword, token],
            (err, result) => {
                if (err) {
                    console.error("❌ Database Insert Error:", err); // Debugging
                    return res.status(500).json({ success: false, message: "Database insert failed!", error: err.sqlMessage });
                }
                res.json({ success: true, message: "Registration successful!", token });
            }
        );
        
    });
});

router.post("/login", (req, res) => {
    const { username, password } = req.body; // 🟢 Use `username` instead of `email`

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Missing username or password!" });
    }

    // ✅ Query Database by Username Instead of Email
    db.query("SELECT * FROM Users WHERE Username = ?", [username], async (err, results) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ success: false, message: "Database error!" });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: "User not found!" });
        }

        const user = results[0];

        // ✅ Compare hashed password
        const match = await bcrypt.compare(password, user.Password);
        if (!match) {
            return res.status(401).json({ success: false, message: "Incorrect password!" });
        }

        // ✅ Generate JWT token
        const token = jwt.sign({ username: user.Username, email: user.Email }, SECRET_KEY, { expiresIn: "1h" });

        res.json({
            success: true,
            message: "Login successful!",
            user: {
                username: user.Username, // 🟢 Now storing username
                email: user.Email
            },
            token
        });
    });
});

module.exports = router;

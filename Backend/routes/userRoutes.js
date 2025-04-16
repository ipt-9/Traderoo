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

router.get("/user/:id/items", (req, res) => {
    const userID = req.params.id;
    const query = `SELECT productID, Title FROM Products WHERE fk_UserID = ?`;
  
    db.query(query, [userID], (err, results) => {
      if (err) return res.status(500).json({ error: "Fehler beim Laden" });
      res.json(results);
    });
  });

  router.get("/:id", (req, res) => {
    const productID = req.params.id;
    const query = `
      SELECT *, Users.Username AS username, Users.Email AS email
FROM Products
JOIN Users ON Products.fk_UserID = Users.id
WHERE Products.productID = ?
    `;
    db.query(query, [productID], (err, results) => {
      if (err) return res.status(500).json({ error: "Fehler beim Abrufen" });
      res.json(results[0]); // Nur ein Produkt erwartet
    });
  });

module.exports = router;

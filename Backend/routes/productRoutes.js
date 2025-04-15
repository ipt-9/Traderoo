const express = require("express");
const router = express.Router();
const db = require("../database");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");


// ✅ Configure Multer for File Uploads (Now Optional)
const storage = multer.diskStorage({
    destination: "./uploads/", // Images will be stored in an 'uploads' folder
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Save file with unique name
    }
});

const upload = multer({ storage });

// ✅ Middleware to parse `FormData`
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// ✅ GET Route: Fetch Product Conditions
router.get("/conditions", (req, res) => {
    db.query("SELECT Condition_Name FROM conditions", (err, results) => {
        if (err) {
            console.error("❌ Error fetching conditions:", err);
            return res.status(500).json({ success: false, message: "Database error!" });
        }

        if (results.length === 0) {
            console.warn("⚠️ No conditions found in the database.");
        }

        res.json(results);
    });
});

// ✅ Handle Trade Creation (Images Now Optional)


router.post("/create", upload.array("images", 5), (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Kein Token mitgeschickt." });
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
        decoded = jwt.verify(token, "geheimes_token"); // dein geheimer Schlüssel
    } catch (err) {
        return res.status(403).json({ success: false, message: "Token ungültig oder abgelaufen." });
    }

    const userID = decoded.userID; // 👈 stelle sicher, dass das im Token steckt!

    const {
        title, description, brand, estimatedValue,
        weight, height, depth, width, fk_Productcondition
    } = req.body;

    const images = req.files?.map(file => file.filename) || [];

    if (!title || !estimatedValue || !fk_Productcondition) {
        return res.status(400).json({ success: false, message: "Pflichtfelder fehlen." });
    }

    const sql = `
        INSERT INTO products 
        (Title, Estimated_Value, Description, Brand, Weight, Height, Depth, Width, Pictures, fk_Productcondition, fk_UserID)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        title,
        estimatedValue,
        description,
        brand,
        weight,
        height,
        depth,
        width,
        images.join(","),
        fk_Productcondition,
        userID // 👈 direkt aus dem Token
    ], (err, result) => {
        if (err) {
            console.error("❌ Insert Error:", err);
            return res.status(500).json({ success: false, message: "Insert fehlgeschlagen!" });
        }

        return res.status(200).json({ success: true, message: "Produkt erfolgreich gespeichert." });
    });
});

router.get("/all", (req, res) => {
    const query = `
        SELECT *, Users.Username AS username
        FROM Products
        JOIN Users ON Products.fk_UserID = Users.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Datenbankfehler' });
        }
        res.json(results);
    });
});

router.get("/:id", (req, res) => {
  const productID = req.params.productID;
  const query = `
    SELECT *, Users.Username AS username
        FROM Products
        JOIN Users ON Products.fk_UserID = Users.id
    WHERE Products.productID = 3
  `;
  db.query(query, [productID], (err, results) => {
    if (err) return res.status(500).json({ error: "Fehler beim Abrufen" });
    res.json(results[0]); // Nur ein Produkt erwartet
  });
});



module.exports = router;

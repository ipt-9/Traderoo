const express = require("express");
const router = express.Router();
const db = require("../database");

// 1️⃣ Fetch all product conditions (for the dropdown)
router.get("/conditions", (req, res) => {
    db.query("SELECT Condition_Name FROM conditions", (err, results) => {
        if (err) {
            console.error("❌ Error fetching conditions:", err);
            return res.status(500).json({ success: false, message: "Database error!" });
        }
        res.json(results);
    });
});

// 2️⃣ Insert new trade (product) with foreign key reference
router.post("/create", (req, res) => {
    const { title, description, brand, estimatedValue, weight, height, depth, width, fk_Productcondition } = req.body;

    if (!title || !estimatedValue || !fk_Productcondition) {
        return res.status(400).json({ success: false, message: "Required fields are missing!" });
    }

    db.query(
        "INSERT INTO products (Title, Estimated_Value, Description, Brand, Weight, Height, Depth, Width, fk_Productcondition) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [title, estimatedValue, description, brand, weight, height, depth, width, fk_Productcondition],
        (err, result) => {
            if (err) {
                console.error("❌ Database Insert Error:", err);
                return res.status(500).json({ success: false, message: "Database insert failed!" });
            }
            res.json({ success: true, message: "Trade created successfully!" });
        }
    );
});

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../database");
const multer = require("multer");
const path = require("path");

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
    console.log("🔍 Received req.body:", req.body); // Debug log
    console.log("🖼 Received req.files:", req.files); // Debug log

    const { title, description, brand, estimatedValue, weight, height, depth, width, fk_Productcondition, fk_Username } = req.body;
    const images = req.files.length > 0 ? req.files.map(file => file.filename).join(",") : null; // ✅ Allow empty

    // 🟢 Debug: Check required fields
    if (!title || !estimatedValue || !fk_Productcondition || !fk_Username) {
        console.error("❌ Missing required fields:", { title, estimatedValue, fk_Productcondition, fk_Username });
        return res.status(400).json({ success: false, message: "Required fields are missing!" });
    }

    // ✅ Insert into Database with `fk_Username`
    const sql = `
        INSERT INTO products (Title, Estimated_Value, Description, Brand, Weight, Height, Depth, Width, Pictures, fk_Username, fk_Productcondition)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [title, estimatedValue, description, brand, weight, height, depth, width, images, fk_Username, fk_Productcondition], (err, result) => {
        if (err) {
            console.error("❌ Database Insert Error:", err);
            return res.status(500).json({ success: false, message: "Database insert failed!" });
        }
        res.json({ success: true, message: "Trade created successfully!" });
    });
});

module.exports = router;

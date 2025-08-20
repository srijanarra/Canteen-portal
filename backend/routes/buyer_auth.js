const express = require("express");
const router = express.Router();
const Buyer = require("../models/Buyer");

// Login route
router.post("/login", async (req, res) => {
  const { email, contact } = req.body;

  try {
    const buyer = await Buyer.findOne({ email, contact });
    if (!buyer) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({
      message: 'Login successful',
      buyerId: buyer._id,          // ✅ send back vendor’s MongoDB _id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }
});

module.exports = router;

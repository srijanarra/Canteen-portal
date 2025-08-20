const express = require("express");
const router = express.Router();
const Buyer = require("../models/Buyer");

// Get buyer profile
router.get("/:id", async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.params.id);
    if (!buyer) return res.status(404).json({ error: "Buyer not found" });
    res.json(buyer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update buyer profile
router.put("/:id", async (req, res) => {
  try {
    const updated = await Buyer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated document
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;


// Add new buyer
router.post("/register", async (req, res) => {
  try {
    const newBuyer = new Buyer(req.body);
    await newBuyer.save();
    res.json({ message: "Buyer registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error registering buyer" });
  }
});

// Get all buyers
router.get("/", async (req, res) => {
  const buyers = await Buyer.find();
  res.json(buyers);
});

module.exports = router;

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
    console.error(err);
    res.status(500).json({ error: 'Error fetching buyer profile' });
  }
});

// Update buyer profile
router.put("/:id", async (req, res) => {
  try {
    const updated = await Buyer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Profile updated successfully', buyer: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating buyer profile' });
  }
});

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

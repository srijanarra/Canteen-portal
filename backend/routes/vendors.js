const express = require("express");
const router = express.Router();
const Vendor = require("../models/Vendor");

// Get vendor profile
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.json(vendor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching vendor profile' });
  }
});

// Update vendor profile
router.put('/:id', async (req, res) => {
  try {
    const updated = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Profile updated successfully', vendor: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating vendor profile' });
  }
});

// Add new vendor
router.post("/register", async (req, res) => {
  try {
    const newVendor = new Vendor(req.body);
    await newVendor.save();
    res.json({ message: "Vendor registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error registering vendor" });
  }
});

// Get all vendors
router.get("/", async (req, res) => {
  const vendors = await Vendor.find();
  res.json(vendors);
});

module.exports = router;

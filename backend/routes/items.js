const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// ✅ Get all items (for buyer food page)
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().populate("vendorId", "shop_name opening_time closing_time");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Error fetching items" });
  }
});


// ✅ Get all items for a vendor
router.get('/:vendorId', async (req, res) => {
  try {
    const items = await Item.find({ vendorId: req.params.vendorId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching items' });
  }
});

// ✅ Add a new item
router.post('/', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Edit an item
router.put('/:id', async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating item' });
  }
});

// ✅ Delete an item
router.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting item' });
  }
});

module.exports = router;

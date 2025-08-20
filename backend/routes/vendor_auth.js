const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor'); // vendor mongoose model

// POST /vendor_auth/login
router.post('/login', async (req, res) => {
  const { email, contact } = req.body;

  try {
    const vendor = await Vendor.findOne({ email, contact });
    if (!vendor) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({
      message: 'Login successful',
      vendorId: vendor._id,          // ✅ send back vendor’s MongoDB _id
      shop_name: vendor.shop_name,   // (optional) extra data
      manager_name: vendor.manager_name
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;

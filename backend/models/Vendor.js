const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  manager_name: { type: String, required: true },
  shop_name: { type: String, unique: true },
  email: { type: String, unique: true },
  contact: { type: String, required: true },
  opening_time: { type: String, required: true },
  closing_time: { type: String, required: true }
});

module.exports = mongoose.model('Vendor', vendorSchema);

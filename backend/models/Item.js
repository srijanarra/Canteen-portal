const mongoose = require('mongoose');

const addonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

const itemSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },      // integer-based pricing
  rating: { type: Number, default: 0, min: 0, max: 5 }, // default 0
  veg: { type: Boolean, required: true },       // true = veg, false = non-veg
  addons: [addonSchema],                        // list of {name, price}
  tags: [String]                                // e.g. ["Drinks", "Cold"]
});

module.exports = mongoose.model('Item', itemSchema);

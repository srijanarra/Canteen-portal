const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true }, // who placed the order
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true }, // which vendor
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }, // which food item
  quantity: { type: Number, required: true, min: 1 },
  addons: [{ name: String, price: Number }], // chosen addons
  totalPrice: { type: Number, required: true }, // base price * quantity + addons
  status: { 
    type: String, 
    enum: ["PLACED", "ACCEPTED", "COOKING", "READY FOR PICKUP", "COMPLETED", "REJECTED"], 
    default: "PLACED" 
  },
  placedTime: { type: Date, default: Date.now } // when order was created
});

module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  contact: { type: String, required: true },
  age: { type: Number, required: true },
  batch: { type: String, enum: ['UG1', 'UG2', 'UG3', 'UG4', 'UG5'] }
});

module.exports = mongoose.model('Buyer', buyerSchema);

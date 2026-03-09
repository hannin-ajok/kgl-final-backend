const mongoose = require('mongoose');

// Procurement stock entries. Sales and credit sales reduce this tonnage over time.
const produceSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  type: { type: String, required: true },
  date: { type: Date, default: Date.now },
  tonnage: { type: Number, required: true, min: 0 },
  cost: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, required: true, min: 0 },
  dealerName: { type: String, required: true },
  dealerContact: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, 'Contact must be a 10-digit phone number']
  },
  branch: { type: String, enum: ['branch maganjo', 'branch matugga'], required: true },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Produce', produceSchema);

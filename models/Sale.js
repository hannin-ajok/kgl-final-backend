const mongoose = require('mongoose');

// Cash sale records linked to both produce and the sales agent who made the sale.
const saleSchema = new mongoose.Schema({
  produce: { type: mongoose.Schema.Types.ObjectId, ref: 'Produce', required: true },
  produceName: { type: String, required: true },
  tonnage: { type: Number, required: true, min: 0.1 },
  amountPaid: { type: Number, required: true, min: 0 },
  buyerName: { type: String, required: true },
  salesAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  branch: { type: String, enum: ['branch maganjo', 'branch matugga'], required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);

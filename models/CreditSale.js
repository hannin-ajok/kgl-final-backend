const mongoose = require('mongoose');

// Credit sale records that track pending payments until marked as paid.
const creditSaleSchema = new mongoose.Schema({
  buyerName: { type: String, required: true },
  nin: { type: String, required: true, minlength: 14, maxlength: 14 },
  location: { type: String, required: true },
  contact: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, 'Contact must be a 10-digit phone number']
  },
  amountDue: { type: Number, required: true, min: 0 },
  produce: { type: mongoose.Schema.Types.ObjectId, ref: 'Produce', required: true },
  produceName: { type: String, required: true },
  produceType: { type: String, required: true },
  tonnage: { type: Number, required: true, min: 0.1 },
  dispatchDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  salesAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  branch: { type: String, enum: ['branch maganjo', 'branch matugga'], required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('CreditSale', creditSaleSchema);

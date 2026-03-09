const Sale = require('../models/Sale');
const Produce = require('../models/Produce');

// POST /api/sales - Record a sale
const recordSale = async (req, res) => {
  try {
    const { produceId, tonnage, amountPaid, buyerName } = req.body;
    const produce = await Produce.findById(produceId);
    if (!produce) return res.status(404).json({ message: 'Produce not found' });
    // Prevent selling more than what's currently in stock.
    if (produce.tonnage < tonnage) {
      return res.status(400).json({ message: `Insufficient stock. Available: ${produce.tonnage} tonnes` });
    }
    // Keep inventory accurate before writing the sale record.
    produce.tonnage -= tonnage;
    await produce.save();
    const sale = await Sale.create({
      produce: produceId,
      produceName: produce.name,
      tonnage, amountPaid, buyerName,
      salesAgent: req.user._id,
      branch: req.user.branch
    });
    res.status(201).json({ message: 'Sale recorded successfully', sale });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/sales - Get sales (branch-filtered for managers)
const getSales = async (req, res) => {
  try {
    // Directors see all branches; everyone else is limited to their own branch.
    const filter = req.user.role === 'director' ? {} : { branch: req.user.branch };
    const sales = await Sale.find(filter).populate('salesAgent', 'name').sort('-createdAt');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { recordSale, getSales };

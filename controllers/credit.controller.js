const CreditSale = require('../models/CreditSale');
const Produce = require('../models/Produce');

// POST /api/credit - Record a credit sale
const recordCreditSale = async (req, res) => {
  try {
    const { buyerName, nin, location, contact, amountDue, produceId, tonnage, dispatchDate, dueDate } = req.body;
    const produce = await Produce.findById(produceId);
    if (!produce) return res.status(404).json({ message: 'Produce not found' });
    // Same stock protection as cash sales: can't dispatch what we don't have.
    if (produce.tonnage < tonnage) {
      return res.status(400).json({ message: `Insufficient stock. Available: ${produce.tonnage} tonnes` });
    }
    // Reserve stock immediately once the credit sale is created.
    produce.tonnage -= tonnage;
    await produce.save();
    const credit = await CreditSale.create({
      buyerName, nin, location, contact, amountDue,
      produce: produceId,
      produceName: produce.name,
      produceType: produce.type,
      tonnage, dispatchDate, dueDate,
      salesAgent: req.user._id,
      branch: req.user.branch
    });
    res.status(201).json({ message: 'Credit sale recorded', credit });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/credit - Get credit sales
const getCreditSales = async (req, res) => {
  try {
    // Directors can audit all credits, while branch users only see their branch.
    const filter = req.user.role === 'director' ? {} : { branch: req.user.branch };
    const credits = await CreditSale.find(filter).populate('salesAgent', 'name').sort('-createdAt');
    res.json(credits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/credit/:id/pay - Mark credit sale as paid
const markAsPaid = async (req, res) => {
  try {
    // Flip status only; keeps a clean audit trail in the same document.
    const credit = await CreditSale.findByIdAndUpdate(req.params.id, { status: 'paid' }, { new: true });
    if (!credit) return res.status(404).json({ message: 'Credit sale not found' });
    res.json({ message: 'Marked as paid', credit });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { recordCreditSale, getCreditSales, markAsPaid };

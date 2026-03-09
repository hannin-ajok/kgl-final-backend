const Sale = require('../models/Sale');
const CreditSale = require('../models/CreditSale');
const Produce = require('../models/Produce');

// GET /api/reports/summary - Director: aggregated totals across all branches
const getSummary = async (req, res) => {
  try {
    // Aggregate cash sales by branch for top-level reporting.
    const salesAgg = await Sale.aggregate([
      { $group: { _id: '$branch', totalSales: { $sum: '$amountPaid' }, totalTonnage: { $sum: '$tonnage' }, count: { $sum: 1 } } }
    ]);
    // Aggregate outstanding credit exposure by branch.
    const creditAgg = await CreditSale.aggregate([
      { $group: { _id: '$branch', totalCredit: { $sum: '$amountDue' }, count: { $sum: 1 } } }
    ]);
    const outOfStock = await Produce.find({ tonnage: 0 }).select('name branch');
    res.json({ salesByBranch: salesAgg, creditByBranch: creditAgg, outOfStock });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports/branch - Manager: their branch report
const getBranchReport = async (req, res) => {
  try {
    const branch = req.user.branch;
    // Pull branch-level datasets separately so the frontend can render each section directly.
    const sales = await Sale.find({ branch }).populate('salesAgent', 'name').sort('-createdAt');
    const credits = await CreditSale.find({ branch, status: 'pending' }).sort('dueDate');
    const stock = await Produce.find({ branch }).select('name type tonnage salePrice');
    const outOfStock = stock.filter(p => p.tonnage === 0);
    res.json({ sales, credits, stock, outOfStock });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSummary, getBranchReport };

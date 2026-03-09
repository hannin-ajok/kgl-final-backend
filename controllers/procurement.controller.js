const Produce = require('../models/Produce');

// POST /api/procurement - Add new produce
const addProduce = async (req, res) => {
  try {
    const { name, type, tonnage, cost, salePrice, dealerName, dealerContact, branch } = req.body;
    // Save who captured this stock item for accountability.
    const produce = await Produce.create({
      name, type, tonnage, cost, salePrice, dealerName, dealerContact, branch,
      recordedBy: req.user._id
    });
    res.status(201).json({ message: 'Produce recorded successfully', produce });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/procurement - Get all produce and filter by branch for managers
const getAllProduce = async (req, res) => {
  try {
    // Directors get full view; branch staff only get their branch inventory.
    const filter = req.user.role === 'director' ? {} : { branch: req.user.branch };
    const produce = await Produce.find(filter).populate('recordedBy', 'name').sort('-createdAt');
    res.json(produce);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/procurement/:id/price - Update sale price
const updatePrice = async (req, res) => {
  try {
    // Only update sale price; leave historical procurement details untouched.
    const produce = await Produce.findByIdAndUpdate(
      req.params.id,
      { salePrice: req.body.salePrice },
      { new: true }
    );
    if (!produce) return res.status(404).json({ message: 'Produce not found' });
    res.json({ message: 'Price updated', produce });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { addProduce, getAllProduce, updatePrice };

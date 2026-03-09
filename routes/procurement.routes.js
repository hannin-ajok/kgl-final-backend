const express = require('express');
const router = express.Router();
const { addProduce, getAllProduce, updatePrice } = require('../controllers/procurement.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

// Procurement is manager-owned; other roles can only view inventory.
router.post('/', protect, allowRoles('manager'), addProduce);
router.get('/', protect, allowRoles('manager', 'agent', 'director'), getAllProduce);
router.put('/:id/price', protect, allowRoles('manager'), updatePrice);

module.exports = router;

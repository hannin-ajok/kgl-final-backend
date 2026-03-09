const express = require('express');
const router = express.Router();
const { recordCreditSale, getCreditSales, markAsPaid } = require('../controllers/credit.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

// Credit sales can be created by branch staff, but only managers can mark paid.
router.post('/', protect, allowRoles('manager', 'agent'), recordCreditSale);
router.get('/', protect, allowRoles('manager', 'agent', 'director'), getCreditSales);
router.patch('/:id/pay', protect, allowRoles('manager'), markAsPaid);

module.exports = router;

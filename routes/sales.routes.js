const express = require('express');
const router = express.Router();
const { recordSale, getSales } = require('../controllers/sales.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

// Sales: agents/managers can write, directors get read-only visibility.
router.post('/', protect, allowRoles('manager', 'agent'), recordSale);
router.get('/', protect, allowRoles('manager', 'agent', 'director'), getSales);

module.exports = router;

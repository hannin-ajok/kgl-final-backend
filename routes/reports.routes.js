const express = require('express');
const router = express.Router();
const { getSummary, getBranchReport } = require('../controllers/reports.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

// Reporting endpoints are split by management level.
router.get('/summary', protect, allowRoles('director'), getSummary);
router.get('/branch', protect, allowRoles('manager'), getBranchReport);

module.exports = router;

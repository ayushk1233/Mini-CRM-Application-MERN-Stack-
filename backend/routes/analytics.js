const express = require('express');
const router = express.Router();
const { getLeadsByStatus, getStats, getLeadStats } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// All analytics routes require authentication
router.use(auth);

router.get('/leads-by-status', getLeadsByStatus);
router.get('/stats', getStats);
router.get('/leads', getLeadStats);

module.exports = router;
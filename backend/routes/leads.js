const express = require('express');
const router = express.Router({ mergeParams: true }); // Important: mergeParams to access :customerId
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead
} = require('../controllers/leadController');
const { requireAdmin } = require('../middleware/role');

// All routes here are already under /api/customers/:customerId/leads
// and authentication is handled by the parent router

// GET routes - accessible to all authenticated users
router.get('/', getLeads);
router.get('/:leadId', getLeadById);

// POST, PUT, DELETE routes - admin only
router.post('/', requireAdmin, createLead);
router.put('/:leadId', requireAdmin, updateLead);
router.delete('/:leadId', requireAdmin, deleteLead);

module.exports = router;
const express = require('express');
const router = express.Router({ mergeParams: true }); // Important: mergeParams to access :customerId
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead
} = require('../controllers/leadController');

// All routes here are already under /api/customers/:customerId/leads
// and authentication is handled by the parent router

router.route('/')
  .post(createLead)
  .get(getLeads);

router.route('/:leadId')
  .get(getLeadById)
  .put(updateLead)
  .delete(deleteLead);

module.exports = router;
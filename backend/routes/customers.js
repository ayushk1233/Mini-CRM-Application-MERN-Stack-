const express = require('express');
const router = express.Router();
const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');
const leadRoutes = require('./leads');

// All customer routes require authentication
router.use(auth);

// Use nested lead routes
router.use('/:customerId/leads', leadRoutes);

// GET routes - accessible to all authenticated users
router.get('/', getCustomers);
router.get('/:id', getCustomerById);

// POST, PUT, DELETE routes - admin only
router.post('/', requireAdmin, createCustomer);
router.put('/:id', requireAdmin, updateCustomer);
router.delete('/:id', requireAdmin, deleteCustomer);

module.exports = router;
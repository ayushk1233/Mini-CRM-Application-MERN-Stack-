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
const leadRoutes = require('./leads');

// All customer routes require authentication
router.use(auth);

// Use nested lead routes
router.use('/:customerId/leads', leadRoutes);

router.route('/')
  .post(createCustomer)
  .get(getCustomers);

router.route('/:id')
  .get(getCustomerById)
  .put(updateCustomer)
  .delete(deleteCustomer);

module.exports = router;
const Customer = require('../models/Customer');
const Lead = require('../models/Lead');
const Joi = require('joi');

// Validation schema
const customerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().max(20).allow(''),
  company: Joi.string().max(100).allow('')
});

const updateCustomerSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  phone: Joi.string().max(20).allow(''),
  company: Joi.string().max(100).allow('')
});

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Private
const createCustomer = async (req, res) => {
  const { error } = customerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  // Check if customer with this email already exists for this user
  const existingCustomer = await Customer.findOne({
    email: req.body.email,
    ownerId: req.user._id
  });

  if (existingCustomer) {
    return res.status(400).json({
      success: false,
      message: 'Customer with this email already exists'
    });
  }

  const customer = await Customer.create({
    ...req.body,
    ownerId: req.user._id
  });

  res.status(201).json({
    success: true,
    data: customer
  });
};

// @desc    Get all customers with pagination and search
// @route   GET /api/customers
// @access  Private
const getCustomers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const skip = (page - 1) * limit;

  // Build query
  let query = {};
  
  // Role-based filtering
  if (req.user.role !== 'admin') {
    query.ownerId = req.user._id;
  }

  // Add search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } }
    ];
  }

  const customers = await Customer.find(query)
    .populate('ownerId', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Customer.countDocuments(query);

  res.json({
    success: true,
    data: customers,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
};

// @desc    Get single customer with leads
// @route   GET /api/customers/:id
// @access  Private
const getCustomerById = async (req, res) => {
  let query = { _id: req.params.id };
  
  // Role-based filtering
  if (req.user.role !== 'admin') {
    query.ownerId = req.user._id;
  }

  const customer = await Customer.findOne(query).populate('ownerId', 'name email');

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: 'Customer not found'
    });
  }

  // Get customer's leads
  const leads = await Lead.find({ customerId: customer._id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: {
      ...customer.toObject(),
      leads
    }
  });
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = async (req, res) => {
  const { error } = updateCustomerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  let query = { _id: req.params.id };
  
  // Role-based filtering
  if (req.user.role !== 'admin') {
    query.ownerId = req.user._id;
  }

  const customer = await Customer.findOneAndUpdate(
    query,
    req.body,
    { new: true, runValidators: true }
  );

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: 'Customer not found or access denied'
    });
  }

  res.json({
    success: true,
    data: customer
  });
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = async (req, res) => {
  let query = { _id: req.params.id };
  
  // Role-based filtering
  if (req.user.role !== 'admin') {
    query.ownerId = req.user._id;
  }

  const customer = await Customer.findOne(query);

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: 'Customer not found or access denied'
    });
  }

  // Delete associated leads
  await Lead.deleteMany({ customerId: customer._id });

  // Delete customer
  await Customer.findByIdAndDelete(customer._id);

  res.json({
    success: true,
    message: 'Customer and associated leads deleted successfully'
  });
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};
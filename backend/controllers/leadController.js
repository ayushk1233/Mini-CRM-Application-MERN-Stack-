const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Joi = require('joi');

// Validation schemas
const leadSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(1000).allow(''),
  status: Joi.string().valid('New', 'Contacted', 'Converted', 'Lost').default('New'),
  value: Joi.number().min(0).default(0)
});

const updateLeadSchema = Joi.object({
  title: Joi.string().min(2).max(200),
  description: Joi.string().max(1000).allow(''),
  status: Joi.string().valid('New', 'Contacted', 'Converted', 'Lost'),
  value: Joi.number().min(0)
});

// @desc    Create a new lead for a customer
// @route   POST /api/customers/:customerId/leads
// @access  Private
const createLead = async (req, res) => {
  const { error } = leadSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  // Check if customer exists and user has access
  let customerQuery = { _id: req.params.customerId };
  if (req.user.role !== 'admin') {
    customerQuery.ownerId = req.user._id;
  }

  const customer = await Customer.findOne(customerQuery);
  if (!customer) {
    return res.status(404).json({
      success: false,
      message: 'Customer not found or access denied'
    });
  }

  const lead = await Lead.create({
    ...req.body,
    customerId: req.params.customerId,
    ownerId: customer.ownerId
  });

  await lead.populate('customerId', 'name email company');

  res.status(201).json({
    success: true,
    data: lead
  });
};

// @desc    Get all leads for a customer
// @route   GET /api/customers/:customerId/leads
// @access  Private
const getLeads = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  const skip = (page - 1) * limit;

  // Check if customer exists and user has access
  let customerQuery = { _id: req.params.customerId };
  if (req.user.role !== 'admin') {
    customerQuery.ownerId = req.user._id;
  }

  const customer = await Customer.findOne(customerQuery);
  if (!customer) {
    return res.status(404).json({
      success: false,
      message: 'Customer not found or access denied'
    });
  }

  // Build leads query
  let leadsQuery = { customerId: req.params.customerId };
  if (status) {
    leadsQuery.status = status;
  }

  const leads = await Lead.find(leadsQuery)
    .populate('customerId', 'name email company')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Lead.countDocuments(leadsQuery);

  res.json({
    success: true,
    data: leads,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
};

// @desc    Get single lead
// @route   GET /api/customers/:customerId/leads/:leadId
// @access  Private
const getLeadById = async (req, res) => {
  // Check if customer exists and user has access
  let customerQuery = { _id: req.params.customerId };
  if (req.user.role !== 'admin') {
    customerQuery.ownerId = req.user._id;
  }

  const customer = await Customer.findOne(customerQuery);
  if (!customer) {
    return res.status(404).json({
      success: false,
      message: 'Customer not found or access denied'
    });
  }

  const lead = await Lead.findOne({
    _id: req.params.leadId,
    customerId: req.params.customerId
  }).populate('customerId', 'name email company');

  if (!lead) {
    return res.status(404).json({
      success: false,
      message: 'Lead not found'
    });
  }

  res.json({
    success: true,
    data: lead
  });
};

// @desc    Update lead
// @route   PUT /api/customers/:customerId/leads/:leadId
// @access  Private
const updateLead = async (req, res) => {
  const { error } = updateLeadSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  // Check if customer exists and user has access
  let customerQuery = { _id: req.params.customerId };
  if (req.user.role !== 'admin') {
    customerQuery.ownerId = req.user._id;
  }

  const customer = await Customer.findOne(customerQuery);
  if (!customer) {
    return res.status(404).json({
      success: false,
      message: 'Customer not found or access denied'
    });
  }

  const lead = await Lead.findOneAndUpdate(
    {
      _id: req.params.leadId,
      customerId: req.params.customerId
    },
    req.body,
    { new: true, runValidators: true }
  ).populate('customerId', 'name email company');

  if (!lead) {
    return res.status(404).json({
      success: false,
      message: 'Lead not found'
    });
  }

  res.json({
    success: true,
    data: lead
  });
};

// @desc    Delete lead
// @route   DELETE /api/customers/:customerId/leads/:leadId
// @access  Private
const deleteLead = async (req, res) => {
  // Check if customer exists and user has access
  let customerQuery = { _id: req.params.customerId };
  if (req.user.role !== 'admin') {
    customerQuery.ownerId = req.user._id;
  }

  const customer = await Customer.findOne(customerQuery);
  if (!customer) {
    return res.status(404).json({
      success: false,
      message: 'Customer not found or access denied'
    });
  }

  const lead = await Lead.findOneAndDelete({
    _id: req.params.leadId,
    customerId: req.params.customerId
  });

  if (!lead) {
    return res.status(404).json({
      success: false,
      message: 'Lead not found'
    });
  }

  res.json({
    success: true,
    message: 'Lead deleted successfully'
  });
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead
};
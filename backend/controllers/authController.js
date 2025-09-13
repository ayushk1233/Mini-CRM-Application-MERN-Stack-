const Joi = require('joi');
const User = require('../models/User');
const SignedUpUser = require('../models/SignedUpUser');

// Admin emails list
const ADMIN_EMAILS = ['admin1@crm.com', 'admin2@crm.com', 'admin3@crm.com'];

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().custom((value, helpers) => {
    if (!value.includes('@') || !value.includes('com')) {
      return helpers.error('string.email');
    }
    return value;
  }).required().messages({
    'string.email': 'Email must contain "@" and "com"'
  }),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords must match'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().custom((value, helpers) => {
    if (!value.includes('@') || !value.includes('com')) {
      return helpers.error('string.email');
    }
    return value;
  }).required().messages({
    'string.email': 'Email must contain "@" and "com"'
  }),
  password: Joi.string().required()
});

// @desc    Register a new user (only as normal user)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists in either collection
    const existingUser = await User.findOne({ email: normalizedEmail }) || 
                        await SignedUpUser.findOne({ email: normalizedEmail });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Check if it's an admin email
    if (ADMIN_EMAILS.includes(normalizedEmail)) {
      // Create admin user in User collection
      const user = await User.create({
        name,
        email: normalizedEmail,
        passwordHash: password,  // will be hashed by pre-save hook
        role: 'admin'
      });

      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: user.generateToken()
        }
      });
    }

    // Create regular user in signedup_users collection
    const user = await SignedUpUser.create({
      name,
      email: normalizedEmail,
      passwordHash: password,  // will be hashed by pre-save hook
      role: 'user'  // enforced as 'user'
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: user.generateToken()
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user (admin from users collection or normal user from signedup_users)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // First check if it's an admin user
    const adminUser = await User.findOne({ email: normalizedEmail });
    if (adminUser) {
      const isMatch = await adminUser.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      return res.json({
        success: true,
        data: {
          _id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: 'admin',
          token: adminUser.generateToken()
        }
      });
    }

    // For non-admin users, create a new SignedUpUser if they don't exist
    let regularUser = await SignedUpUser.findOne({ email: normalizedEmail });
    if (!regularUser) {
      // Auto-register new user
      regularUser = await SignedUpUser.create({
        name: email.split('@')[0], // Use part before @ as name
        email: normalizedEmail,
        passwordHash: password,
        role: 'user'
      });
    }

    // Check password for existing users
    const passwordMatch = await regularUser.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Send successful response
    res.json({
      success: true,
      data: {
        _id: regularUser._id,
        name: regularUser.name,
        email: regularUser.email,
        role: regularUser.role || 'user',
        token: regularUser.generateToken()
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
};

module.exports = {
  register,
  login,
  getMe
};

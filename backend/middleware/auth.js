const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SignedUpUser = require('../models/SignedUpUser');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token, authorization denied' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // First try to find in admin users collection
    let user = await User.findById(decoded.id).select('-passwordHash');
    
    // If not found, try signedup_users collection
    if (!user) {
      user = await SignedUpUser.findById(decoded.id).select('-passwordHash');
    }
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token is not valid' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

module.exports = auth;
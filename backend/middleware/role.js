const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only admins are allowed to perform this action'
    });
  }

  next();
};

const roleAuth = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No user found.'
      });
    }

    // Allow read operations for all authenticated users
    if (req.method === 'GET') {
      return next();
    }

    // For non-GET requests (modifications), check role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only admins are allowed to perform this action'
      });
    }

    next();
  };
};

// Legacy support - maps to isAdmin for compatibility
const requireAdmin = isAdmin;

module.exports = { roleAuth, requireAdmin };
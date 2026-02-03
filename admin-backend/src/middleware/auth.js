const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { hasPermission, hasMinimumRole } = require('../config/roles');

/**
 * Middleware to verify JWT token and attach user to request
 */
const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'This user account has been deactivated.'
      });
    }

    // Check if user changed password after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        success: false,
        message: 'User recently changed password. Please log in again.'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error authenticating user.'
    });
  }
};

/**
 * Middleware to check if user has required permission
 */
const authorize = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated.'
      });
    }

    const hasRequiredPermission = permissions.some((permission) =>
      hasPermission(req.user.role, permission)
    );

    if (!hasRequiredPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.'
      });
    }

    next();
  };
};

/**
 * Middleware to check if user has minimum role level
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated.'
      });
    }

    const hasRole = roles.some((role) => hasMinimumRole(req.user.role, role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `This action requires one of the following roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
  requireRole
};

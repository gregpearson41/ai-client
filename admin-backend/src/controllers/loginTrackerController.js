const LoginTracker = require('../models/LoginTracker');

/**
 * @desc    Get all tracked logins (populated with user info)
 * @route   GET /api/login-tracker
 * @access  Private
 */
const getLogins = async (req, res) => {
  try {
    const logins = await LoginTracker.find()
      .populate('userId', 'email name role')
      .sort({ dateTimeStamp: -1 });

    const formatted = logins.map((entry) => ({
      _id: entry._id,
      email: entry.userId?.email || '—',
      name: entry.userId?.name || '—',
      role: entry.userId?.role || '—',
      timeLoggedIn: entry.dateTimeStamp
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error('Get logins error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching login records'
    });
  }
};

module.exports = { getLogins };

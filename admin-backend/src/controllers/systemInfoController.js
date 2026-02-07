const SystemInfo = require('../models/SystemInfo');

/**
 * @desc    Get system info
 * @route   GET /api/system-info
 * @access  Public
 */
const getSystemInfo = async (req, res) => {
  try {
    const info = await SystemInfo.findOne();

    if (!info) {
      return res.status(404).json({
        success: false,
        message: 'System info not found'
      });
    }

    res.json({
      success: true,
      data: info
    });
  } catch (error) {
    console.error('Get system info error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching system info'
    });
  }
};

module.exports = {
  getSystemInfo
};

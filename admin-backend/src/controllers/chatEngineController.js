const ChatEngine = require('../models/ChatEngine');

/**
 * @desc    Get all chat engines
 * @route   GET /api/chat-engines
 * @access  Private
 */
const getChatEngines = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, active } = req.query;

    // Build query object
    const query = {};

    if (active !== undefined) {
      query.active = active === 'true';
    }

    if (search) {
      query.$or = [
        { engine_name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const chatEngines = await ChatEngine.find(query)
      .sort({ creation_date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ChatEngine.countDocuments(query);

    res.json({
      success: true,
      data: chatEngines,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get chat engines error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chat engines'
    });
  }
};

/**
 * @desc    Get chat engine by ID
 * @route   GET /api/chat-engines/:id
 * @access  Private
 */
const getChatEngineById = async (req, res) => {
  try {
    const chatEngine = await ChatEngine.findById(req.params.id);

    if (!chatEngine) {
      return res.status(404).json({
        success: false,
        message: 'Chat engine not found'
      });
    }

    res.json({
      success: true,
      data: chatEngine
    });
  } catch (error) {
    console.error('Get chat engine error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chat engine'
    });
  }
};

/**
 * @desc    Create a new chat engine
 * @route   POST /api/chat-engines
 * @access  Private
 */
const createChatEngine = async (req, res) => {
  try {
    const { engine_name, description, api_key, active } = req.body;

    const chatEngine = await ChatEngine.create({
      engine_name,
      description,
      api_key,
      active: active !== undefined ? active : true,
      creation_date: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Chat engine created successfully',
      data: chatEngine
    });
  } catch (error) {
    console.error('Create chat engine error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating chat engine'
    });
  }
};

/**
 * @desc    Update chat engine
 * @route   PUT /api/chat-engines/:id
 * @access  Private
 */
const updateChatEngine = async (req, res) => {
  try {
    const { engine_name, description, api_key, active } = req.body;

    const chatEngine = await ChatEngine.findByIdAndUpdate(
      req.params.id,
      { engine_name, description, api_key, active },
      { new: true, runValidators: true }
    );

    if (!chatEngine) {
      return res.status(404).json({
        success: false,
        message: 'Chat engine not found'
      });
    }

    res.json({
      success: true,
      message: 'Chat engine updated successfully',
      data: chatEngine
    });
  } catch (error) {
    console.error('Update chat engine error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating chat engine'
    });
  }
};

/**
 * @desc    Delete chat engine
 * @route   DELETE /api/chat-engines/:id
 * @access  Private
 */
const deleteChatEngine = async (req, res) => {
  try {
    const chatEngine = await ChatEngine.findByIdAndDelete(req.params.id);

    if (!chatEngine) {
      return res.status(404).json({
        success: false,
        message: 'Chat engine not found'
      });
    }

    res.json({
      success: true,
      message: 'Chat engine deleted successfully'
    });
  } catch (error) {
    console.error('Delete chat engine error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting chat engine'
    });
  }
};

/**
 * @desc    Toggle chat engine active status
 * @route   PATCH /api/chat-engines/:id/status
 * @access  Private
 */
const toggleChatEngineStatus = async (req, res) => {
  try {
    const chatEngine = await ChatEngine.findById(req.params.id);

    if (!chatEngine) {
      return res.status(404).json({
        success: false,
        message: 'Chat engine not found'
      });
    }

    chatEngine.active = !chatEngine.active;
    await chatEngine.save();

    res.json({
      success: true,
      message: `Chat engine ${chatEngine.active ? 'activated' : 'deactivated'} successfully`,
      data: chatEngine
    });
  } catch (error) {
    console.error('Toggle chat engine status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling chat engine status'
    });
  }
};

/**
 * @desc    Get all active chat engines (public, no auth)
 * @route   GET /api/public/chat-engines
 * @access  Public
 */
const getPublicChatEngines = async (req, res) => {
  try {
    const chatEngines = await ChatEngine.find({ active: true })
      .select('_id engine_name description')
      .sort({ engine_name: 1 });

    res.json({
      success: true,
      data: chatEngines
    });
  } catch (error) {
    console.error('Get public chat engines error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chat engines'
    });
  }
};

module.exports = {
  getChatEngines,
  getChatEngineById,
  createChatEngine,
  updateChatEngine,
  deleteChatEngine,
  toggleChatEngineStatus,
  getPublicChatEngines
};

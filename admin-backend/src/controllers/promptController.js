const Prompt = require('../models/Prompt');

/**
 * @desc    Get all prompts
 * @route   GET /api/prompts
 * @access  Private
 */
const getPrompts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, created_by } = req.query;

    // Build query object
    const query = {};

    if (created_by) {
      query.created_by = created_by;
    }

    if (search) {
      query.$or = [
        { prompt_name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const prompts = await Prompt.find(query)
      .populate('chat_engine', 'engine_name active')
      .sort({ created_date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Prompt.countDocuments(query);

    res.json({
      success: true,
      data: prompts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get prompts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching prompts'
    });
  }
};

/**
 * @desc    Get prompt by ID
 * @route   GET /api/prompts/:id
 * @access  Private
 */
const getPromptById = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id)
      .populate('chat_engine', 'engine_name active');

    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: 'Prompt not found'
      });
    }

    res.json({
      success: true,
      data: prompt
    });
  } catch (error) {
    console.error('Get prompt error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching prompt'
    });
  }
};

/**
 * @desc    Create a new prompt
 * @route   POST /api/prompts
 * @access  Private
 */
const createPrompt = async (req, res) => {
  try {
    const { prompt_name, prompt, description, created_by, chat_engine } = req.body;

    const newPrompt = await Prompt.create({
      prompt_name,
      prompt,
      description,
      created_by,
      chat_engine: chat_engine || null,
      created_date: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Prompt created successfully',
      data: newPrompt
    });
  } catch (error) {
    console.error('Create prompt error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating prompt'
    });
  }
};

/**
 * @desc    Update prompt
 * @route   PUT /api/prompts/:id
 * @access  Private
 */
const updatePrompt = async (req, res) => {
  try {
    const { prompt_name, prompt, description, created_by, chat_engine } = req.body;

    const updateData = { prompt_name, prompt, description, created_by };
    if (chat_engine !== undefined) {
      updateData.chat_engine = chat_engine || null;
    }

    const updatedPrompt = await Prompt.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPrompt) {
      return res.status(404).json({
        success: false,
        message: 'Prompt not found'
      });
    }

    res.json({
      success: true,
      message: 'Prompt updated successfully',
      data: updatedPrompt
    });
  } catch (error) {
    console.error('Update prompt error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating prompt'
    });
  }
};

/**
 * @desc    Delete prompt
 * @route   DELETE /api/prompts/:id
 * @access  Private
 */
const deletePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findByIdAndDelete(req.params.id);

    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: 'Prompt not found'
      });
    }

    res.json({
      success: true,
      message: 'Prompt deleted successfully'
    });
  } catch (error) {
    console.error('Delete prompt error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting prompt'
    });
  }
};

module.exports = {
  getPrompts,
  getPromptById,
  createPrompt,
  updatePrompt,
  deletePrompt
};

const Topic = require('../models/Topic');

/**
 * @desc    Get all topics
 * @route   GET /api/topics
 * @access  Private
 */
const getTopics = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, created_by, active } = req.query;

    // Build query
    const query = {};

    if (created_by) {
      query.created_by = created_by;
    }

    if (active !== undefined) {
      query.active = active === 'true';
    }

    if (search) {
      query.$or = [
        { topic_name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const topics = await Topic.find(query)
      .populate('prompt', 'prompt_name description')
      .sort({ created_date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Topic.countDocuments(query);

    res.json({
      success: true,
      data: topics,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching topics'
    });
  }
};

/**
 * @desc    Get topic by ID
 * @route   GET /api/topics/:id
 * @access  Private
 */
const getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate('prompt', 'prompt_name description');

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    res.json({
      success: true,
      data: topic
    });
  } catch (error) {
    console.error('Get topic error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching topic'
    });
  }
};

/**
 * @desc    Create a new topic
 * @route   POST /api/topics
 * @access  Private
 */
const createTopic = async (req, res) => {
  try {
    const { topic_name, topic_label, description, created_by, prompt } = req.body;

    const topic = await Topic.create({
      topic_name,
      topic_label,
      description,
      created_by,
      prompt: prompt || null,
      created_date: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Topic created successfully',
      data: topic
    });
  } catch (error) {
    console.error('Create topic error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating topic'
    });
  }
};

/**
 * @desc    Update topic
 * @route   PUT /api/topics/:id
 * @access  Private
 */
const updateTopic = async (req, res) => {
  try {
    const { topic_name, topic_label, description, created_by, active, prompt } = req.body;

    const updateData = {};
    if (topic_name !== undefined) updateData.topic_name = topic_name;
    if (topic_label !== undefined) updateData.topic_label = topic_label;
    if (description !== undefined) updateData.description = description;
    if (created_by !== undefined) updateData.created_by = created_by;
    if (active !== undefined) updateData.active = active;
    if (prompt !== undefined) updateData.prompt = prompt || null;

    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    res.json({
      success: true,
      message: 'Topic updated successfully',
      data: topic
    });
  } catch (error) {
    console.error('Update topic error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating topic'
    });
  }
};

/**
 * @desc    Delete topic
 * @route   DELETE /api/topics/:id
 * @access  Private
 */
const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    res.json({
      success: true,
      message: 'Topic deleted successfully'
    });
  } catch (error) {
    console.error('Delete topic error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting topic'
    });
  }
};

/**
 * @desc    Toggle topic active status
 * @route   PATCH /api/topics/:id/status
 * @access  Private
 */
const toggleTopicStatus = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    topic.active = req.body.active !== undefined ? req.body.active : !topic.active;
    await topic.save();

    res.json({
      success: true,
      message: `Topic ${topic.active ? 'activated' : 'deactivated'} successfully`,
      data: topic
    });
  } catch (error) {
    console.error('Toggle topic status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating topic status'
    });
  }
};

/**
 * @desc    Get all active topics (public, no auth)
 * @route   GET /api/public/topics
 * @access  Public
 */
const getPublicTopics = async (req, res) => {
  try {
    const topics = await Topic.find({ active: true })
      .populate('prompt', 'prompt_name prompt description')
      .select('_id topic_name topic_label description prompt')
      .sort({ topic_label: 1 });

    res.json({
      success: true,
      data: topics
    });
  } catch (error) {
    console.error('Get public topics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching topics'
    });
  }
};

module.exports = {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  toggleTopicStatus,
  getPublicTopics
};

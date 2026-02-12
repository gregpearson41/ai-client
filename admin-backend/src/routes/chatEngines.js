const express = require('express');
const { body, param, query } = require('express-validator');
const chatEngineController = require('../controllers/chatEngineController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET all chat engines with pagination
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isString(),
    query('active').optional().isBoolean()
  ],
  validate,
  chatEngineController.getChatEngines
);

// GET chat engine by ID
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid chat engine ID')],
  validate,
  chatEngineController.getChatEngineById
);

// POST create chat engine
router.post(
  '/',
  [
    body('engine_name').notEmpty().withMessage('Engine name is required'),
    body('description').optional().isString(),
    body('api_key').notEmpty().withMessage('API key is required'),
    body('active').optional().isBoolean()
  ],
  validate,
  chatEngineController.createChatEngine
);

// PUT update chat engine
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid chat engine ID'),
    body('engine_name').optional().notEmpty().withMessage('Engine name cannot be empty'),
    body('description').optional().isString(),
    body('api_key').optional().notEmpty().withMessage('API key cannot be empty'),
    body('active').optional().isBoolean()
  ],
  validate,
  chatEngineController.updateChatEngine
);

// DELETE chat engine
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid chat engine ID')],
  validate,
  chatEngineController.deleteChatEngine
);

// PATCH toggle chat engine active status
router.patch(
  '/:id/status',
  [param('id').isMongoId().withMessage('Invalid chat engine ID')],
  validate,
  chatEngineController.toggleChatEngineStatus
);

module.exports = router;

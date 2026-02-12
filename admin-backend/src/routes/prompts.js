const express = require('express');
const { body, param, query } = require('express-validator');
const promptController = require('../controllers/promptController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET all prompts with pagination
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isString(),
    query('created_by').optional().isString()
  ],
  validate,
  promptController.getPrompts
);

// GET prompt by ID
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid prompt ID')],
  validate,
  promptController.getPromptById
);

// POST create prompt
router.post(
  '/',
  [
    body('prompt_name').notEmpty().withMessage('Prompt name is required'),
    body('prompt').notEmpty().withMessage('Prompt is required'),
    body('description').optional().isString(),
    body('created_by').notEmpty().withMessage('Created by is required'),
    body('chat_engine').optional({ values: 'null' }).isMongoId().withMessage('Invalid chat engine ID')
  ],
  validate,
  promptController.createPrompt
);

// PUT update prompt
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid prompt ID'),
    body('prompt_name').optional().notEmpty().withMessage('Prompt name cannot be empty'),
    body('prompt').optional().notEmpty().withMessage('Prompt cannot be empty'),
    body('description').optional().isString(),
    body('created_by').optional().notEmpty().withMessage('Created by cannot be empty'),
    body('chat_engine').optional({ values: 'null' }).isMongoId().withMessage('Invalid chat engine ID')
  ],
  validate,
  promptController.updatePrompt
);

// DELETE prompt
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid prompt ID')],
  validate,
  promptController.deletePrompt
);

module.exports = router;

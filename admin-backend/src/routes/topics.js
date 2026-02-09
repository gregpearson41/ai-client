const express = require('express');
const { body, param, query } = require('express-validator');
const topicController = require('../controllers/topicController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Topics
 *   description: Topic management
 */

/**
 * @swagger
 * /api/topics:
 *   get:
 *     summary: Get all topics
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of topics per page
 *       - in: query
 *         name: created_by
 *         schema:
 *           type: string
 *         description: Filter by creator
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by topic name or description
 *     responses:
 *       200:
 *         description: List of topics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Topic'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Not authenticated
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validate,
  topicController.getTopics
);

/**
 * @swagger
 * /api/topics/{id}:
 *   get:
 *     summary: Get topic by ID
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Topic ID
 *     responses:
 *       200:
 *         description: Topic details
 *       404:
 *         description: Topic not found
 */
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid topic ID')],
  validate,
  topicController.getTopicById
);

/**
 * @swagger
 * /api/topics:
 *   post:
 *     summary: Create a new topic
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic_name
 *               - topic_label
 *               - created_by
 *             properties:
 *               topic_name:
 *                 type: string
 *                 description: Must not contain spaces
 *               topic_label:
 *                 type: string
 *                 description: Display label for the topic
 *               description:
 *                 type: string
 *               created_by:
 *                 type: string
 *     responses:
 *       201:
 *         description: Topic created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  '/',
  [
    body('topic_name')
      .notEmpty().withMessage('Topic name is required')
      .matches(/^\S+$/).withMessage('Topic name must not contain spaces'),
    body('topic_label').notEmpty().withMessage('Topic label is required'),
    body('description').optional().isString(),
    body('created_by').notEmpty().withMessage('Created by is required')
  ],
  validate,
  topicController.createTopic
);

/**
 * @swagger
 * /api/topics/{id}:
 *   put:
 *     summary: Update topic
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Topic ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic_name:
 *                 type: string
 *                 description: Must not contain spaces
 *               topic_label:
 *                 type: string
 *                 description: Display label for the topic
 *               description:
 *                 type: string
 *               created_by:
 *                 type: string
 *     responses:
 *       200:
 *         description: Topic updated successfully
 *       404:
 *         description: Topic not found
 */
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid topic ID'),
    body('topic_name')
      .optional()
      .notEmpty().withMessage('Topic name cannot be empty')
      .matches(/^\S+$/).withMessage('Topic name must not contain spaces'),
    body('topic_label').optional().notEmpty().withMessage('Topic label cannot be empty'),
    body('description').optional().isString(),
    body('created_by').optional().notEmpty().withMessage('Created by cannot be empty')
  ],
  validate,
  topicController.updateTopic
);

/**
 * @swagger
 * /api/topics/{id}:
 *   delete:
 *     summary: Delete topic
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Topic ID
 *     responses:
 *       200:
 *         description: Topic deleted successfully
 *       404:
 *         description: Topic not found
 */
/**
 * @swagger
 * /api/topics/{id}/status:
 *   patch:
 *     summary: Toggle topic active status
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Topic ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Topic status updated
 *       404:
 *         description: Topic not found
 */
router.patch(
  '/:id/status',
  [param('id').isMongoId().withMessage('Invalid topic ID')],
  validate,
  topicController.toggleTopicStatus
);

router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid topic ID')],
  validate,
  topicController.deleteTopic
);

module.exports = router;

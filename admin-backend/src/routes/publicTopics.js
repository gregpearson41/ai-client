const express = require('express');
const topicController = require('../controllers/topicController');
const promptController = require('../controllers/promptController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Public
 *   description: Public endpoints (no authentication required)
 */

/**
 * @swagger
 * /api/public/topics:
 *   get:
 *     summary: Get all active topics (public)
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: List of active topics
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       topic_name:
 *                         type: string
 *                       topic_label:
 *                         type: string
 *                       description:
 *                         type: string
 */
router.get('/topics', topicController.getPublicTopics);

/**
 * @swagger
 * /api/public/prompts:
 *   get:
 *     summary: Get all prompts (public)
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: List of prompts
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       prompt_name:
 *                         type: string
 *                       description:
 *                         type: string
 */
router.get('/prompts', promptController.getPublicPrompts);

module.exports = router;

const express = require('express');
const topicController = require('../controllers/topicController');
const promptController = require('../controllers/promptController');
const chatEngineController = require('../controllers/chatEngineController');
const chatPromptController = require('../controllers/chatPromptController');

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

/**
 * @swagger
 * /api/public/chat-engines:
 *   get:
 *     summary: Get all active chat engines (public)
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: List of active chat engines
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
 *                       engine_name:
 *                         type: string
 *                       description:
 *                         type: string
 */
router.get('/chat-engines', chatEngineController.getPublicChatEngines);

/**
 * @swagger
 * /api/public/chat-prompt:
 *   post:
 *     summary: Submit a question to an AI chat engine (public)
 *     tags: [Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - chat_engine_id
 *             properties:
 *               question:
 *                 type: string
 *                 description: The user's question
 *               topic_id:
 *                 type: string
 *                 description: Topic ID (optional)
 *               prompt_id:
 *                 type: string
 *                 description: Prompt ID (optional)
 *               chat_engine_id:
 *                 type: string
 *                 description: Chat engine ID
 *     responses:
 *       200:
 *         description: AI response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     response:
 *                       type: string
 *                     engine:
 *                       type: string
 *                     topic:
 *                       type: object
 *                     prompt:
 *                       type: object
 *       400:
 *         description: Validation error
 *       404:
 *         description: Resource not found
 *       500:
 *         description: AI API error
 */
router.post('/chat-prompt', chatPromptController.submitChatPrompt);

module.exports = router;

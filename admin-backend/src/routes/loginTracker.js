const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getLogins } = require('../controllers/loginTrackerController');

/**
 * @swagger
 * /api/login-tracker:
 *   get:
 *     summary: Get all tracked logins
 *     tags: [Login Tracker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of login records
 */
router.get('/', authenticate, getLogins);

module.exports = router;

const express = require('express');
const systemInfoController = require('../controllers/systemInfoController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SystemInfo
 *   description: Public system information
 */

/**
 * @swagger
 * /api/system-info:
 *   get:
 *     summary: Get system info
 *     tags: [SystemInfo]
 *     responses:
 *       200:
 *         description: System information
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
 *                     companyOwner:
 *                       type: string
 *                     version:
 *                       type: string
 *                     buildNumber:
 *                       type: string
 *       404:
 *         description: System info not found
 */
router.get('/', systemInfoController.getSystemInfo);

module.exports = router;

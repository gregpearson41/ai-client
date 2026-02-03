const express = require('express');
const { body, param, query } = require('express-validator');
const userController = require('../controllers/userController');
const { authenticate, authorize, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { ROLES } = require('../config/roles');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (Admin only)
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
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
 *         description: Number of users per page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [App Admin, Owner, Editor, Viewer]
 *         description: Filter by role
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *     responses:
 *       200:
 *         description: List of users
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
 *                     $ref: '#/components/schemas/User'
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
 *       403:
 *         description: Not authorized
 */
router.get(
  '/',
  authorize('manage_users'),
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('role').optional().isIn(Object.values(ROLES)),
    query('isActive').optional().isBoolean()
  ],
  validate,
  userController.getUsers
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get(
  '/:id',
  authorize('manage_users'),
  [param('id').isMongoId().withMessage('Invalid user ID')],
  validate,
  userController.getUserById
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error or user already exists
 *       403:
 *         description: Not authorized
 */
router.post(
  '/',
  requireRole(ROLES.APP_ADMIN),
  [
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required'),
    body('role').optional().isIn(Object.values(ROLES)).withMessage('Invalid role')
  ],
  validate,
  userController.createUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [App Admin, Owner, Editor, Viewer]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put(
  '/:id',
  requireRole(ROLES.APP_ADMIN),
  [
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('email').optional().isEmail().withMessage('Please provide a valid email address'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('role').optional().isIn(Object.values(ROLES)).withMessage('Invalid role'),
    body('isActive').optional().isBoolean()
  ],
  validate,
  userController.updateUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Cannot delete own account
 *       404:
 *         description: User not found
 */
router.delete(
  '/:id',
  requireRole(ROLES.APP_ADMIN),
  [param('id').isMongoId().withMessage('Invalid user ID')],
  validate,
  userController.deleteUser
);

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Update user role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [App Admin, Owner, Editor, Viewer]
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Cannot change own role
 *       404:
 *         description: User not found
 */
router.patch(
  '/:id/role',
  requireRole(ROLES.APP_ADMIN),
  [
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('role').isIn(Object.values(ROLES)).withMessage('Invalid role')
  ],
  validate,
  userController.updateUserRole
);

/**
 * @swagger
 * /api/users/{id}/status:
 *   patch:
 *     summary: Toggle user active status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User status toggled successfully
 *       400:
 *         description: Cannot deactivate own account
 *       404:
 *         description: User not found
 */
router.patch(
  '/:id/status',
  requireRole(ROLES.APP_ADMIN),
  [param('id').isMongoId().withMessage('Invalid user ID')],
  validate,
  userController.toggleUserStatus
);

module.exports = router;

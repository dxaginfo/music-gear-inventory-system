/**
 * Equipment Routes
 * Handles all API endpoints for equipment management
 */
const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();
const equipmentController = require('../controllers/equipment.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validationMiddleware = require('../middleware/validation.middleware');
const uploadMiddleware = require('../middleware/upload.middleware');

/**
 * @route   GET /api/equipment
 * @desc    Get all equipment for the organization
 * @access  Private
 */
router.get(
  '/',
  authMiddleware.authenticateToken,
  query('category').optional().isString(),
  query('condition').optional().isIn(['EXCELLENT', 'GOOD', 'FAIR', 'POOR']),
  query('location').optional().isString(),
  query('search').optional().isString(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validationMiddleware.validate,
  equipmentController.getAllEquipment
);

/**
 * @route   GET /api/equipment/:id
 * @desc    Get a single equipment item by ID
 * @access  Private
 */
router.get(
  '/:id',
  authMiddleware.authenticateToken,
  param('id').isUUID(),
  validationMiddleware.validate,
  equipmentController.getEquipmentById
);

/**
 * @route   POST /api/equipment
 * @desc    Create a new equipment item
 * @access  Private
 */
router.post(
  '/',
  authMiddleware.authenticateToken,
  body('name').isString().trim().notEmpty().withMessage('Equipment name is required'),
  body('type').isString().trim().notEmpty().withMessage('Equipment type is required'),
  body('categoryId').optional().isUUID(),
  body('brand').optional().isString().trim(),
  body('model').optional().isString().trim(),
  body('serialNumber').optional().isString().trim(),
  body('purchaseDate').optional().isISO8601(),
  body('purchasePrice').optional().isFloat({ min: 0 }),
  body('currentValue').optional().isFloat({ min: 0 }),
  body('condition').optional().isIn(['EXCELLENT', 'GOOD', 'FAIR', 'POOR']),
  body('notes').optional().isString(),
  body('location').optional().isString().trim(),
  validationMiddleware.validate,
  equipmentController.createEquipment
);

/**
 * @route   PUT /api/equipment/:id
 * @desc    Update an equipment item
 * @access  Private
 */
router.put(
  '/:id',
  authMiddleware.authenticateToken,
  param('id').isUUID(),
  body('name').optional().isString().trim().notEmpty(),
  body('type').optional().isString().trim().notEmpty(),
  body('categoryId').optional().isUUID(),
  body('brand').optional().isString().trim(),
  body('model').optional().isString().trim(),
  body('serialNumber').optional().isString().trim(),
  body('purchaseDate').optional().isISO8601(),
  body('purchasePrice').optional().isFloat({ min: 0 }),
  body('currentValue').optional().isFloat({ min: 0 }),
  body('condition').optional().isIn(['EXCELLENT', 'GOOD', 'FAIR', 'POOR']),
  body('notes').optional().isString(),
  body('location').optional().isString().trim(),
  body('assignedToId').optional().isUUID(),
  validationMiddleware.validate,
  equipmentController.updateEquipment
);

/**
 * @route   DELETE /api/equipment/:id
 * @desc    Delete an equipment item
 * @access  Private
 */
router.delete(
  '/:id',
  authMiddleware.authenticateToken,
  param('id').isUUID(),
  validationMiddleware.validate,
  equipmentController.deleteEquipment
);

/**
 * @route   POST /api/equipment/:id/photos
 * @desc    Upload photos for an equipment item
 * @access  Private
 */
router.post(
  '/:id/photos',
  authMiddleware.authenticateToken,
  param('id').isUUID(),
  uploadMiddleware.array('photos', 5),
  validationMiddleware.validate,
  equipmentController.uploadEquipmentPhotos
);

/**
 * @route   DELETE /api/equipment/:equipmentId/photos/:photoId
 * @desc    Delete an equipment photo
 * @access  Private
 */
router.delete(
  '/:equipmentId/photos/:photoId',
  authMiddleware.authenticateToken,
  param('equipmentId').isUUID(),
  param('photoId').isUUID(),
  validationMiddleware.validate,
  equipmentController.deleteEquipmentPhoto
);

/**
 * @route   POST /api/equipment/:id/qrcode
 * @desc    Generate QR code for equipment
 * @access  Private
 */
router.post(
  '/:id/qrcode',
  authMiddleware.authenticateToken,
  param('id').isUUID(),
  validationMiddleware.validate,
  equipmentController.generateQRCode
);

/**
 * @route   GET /api/equipment/stats
 * @desc    Get equipment statistics
 * @access  Private
 */
router.get(
  '/stats/summary',
  authMiddleware.authenticateToken,
  equipmentController.getEquipmentStatistics
);

/**
 * @route   GET /api/equipment/categories
 * @desc    Get all equipment categories
 * @access  Private
 */
router.get(
  '/categories/all',
  authMiddleware.authenticateToken,
  equipmentController.getAllCategories
);

/**
 * @route   POST /api/equipment/categories
 * @desc    Create a new equipment category
 * @access  Private
 */
router.post(
  '/categories',
  authMiddleware.authenticateToken,
  body('name').isString().trim().notEmpty().withMessage('Category name is required'),
  body('parentCategoryId').optional().isUUID(),
  validationMiddleware.validate,
  equipmentController.createCategory
);

module.exports = router;
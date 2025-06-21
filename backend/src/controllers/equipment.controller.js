/**
 * Equipment Controller
 * Handles business logic for equipment-related operations
 */
const { PrismaClient } = require('@prisma/client');
const AWS = require('aws-sdk');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const AppError = require('../utils/appError');
const prisma = new PrismaClient();

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

/**
 * Get all equipment for the organization
 */
exports.getAllEquipment = async (req, res, next) => {
  try {
    const { 
      category, 
      condition, 
      location, 
      search,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 20
    } = req.query;

    // Get organization ID from authenticated user
    const organizationId = req.user.organizationId;

    // Build filter conditions
    const where = { organizationId };
    
    if (category) {
      where.categoryId = category;
    }
    
    if (condition) {
      where.condition = condition;
    }
    
    if (location) {
      where.location = location;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build sort order
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    // Query equipment with relations
    const [equipment, total] = await Promise.all([
      prisma.equipment.findMany({
        where,
        include: {
          category: true,
          photos: {
            where: { isPrimary: true },
            take: 1
          },
          maintenanceSchedules: {
            orderBy: { nextDue: 'asc' },
            take: 1
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy,
        skip,
        take: Number(limit)
      }),
      prisma.equipment.count({ where })
    ]);

    // Format response with pagination
    const totalPages = Math.ceil(total / limit);
    
    return res.status(200).json({
      status: 'success',
      results: equipment.length,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages
      },
      data: equipment
    });
  } catch (error) {
    logger.error('Error fetching equipment:', error);
    return next(new AppError('Failed to fetch equipment', 500));
  }
};

/**
 * Get a single equipment item by ID
 */
exports.getEquipmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    const equipment = await prisma.equipment.findFirst({
      where: {
        id,
        organizationId
      },
      include: {
        category: true,
        photos: true,
        maintenanceSchedules: true,
        maintenanceLogs: {
          include: {
            performedBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            performedDate: 'desc'
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        eventEquipment: {
          include: {
            event: true,
            checkedOutBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            checkedInBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            checkedOut: 'desc'
          },
          take: 5
        }
      }
    });

    if (!equipment) {
      return next(new AppError('Equipment not found', 404));
    }

    return res.status(200).json({
      status: 'success',
      data: equipment
    });
  } catch (error) {
    logger.error('Error fetching equipment by ID:', error);
    return next(new AppError('Failed to fetch equipment details', 500));
  }
};

/**
 * Create a new equipment item
 */
exports.createEquipment = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const userId = req.user.id;
    
    const equipmentData = {
      ...req.body,
      organizationId
    };

    // Create the equipment record
    const newEquipment = await prisma.equipment.create({
      data: equipmentData
    });

    return res.status(201).json({
      status: 'success',
      data: newEquipment
    });
  } catch (error) {
    logger.error('Error creating equipment:', error);
    return next(new AppError('Failed to create equipment', 500));
  }
};

/**
 * Update an equipment item
 */
exports.updateEquipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;
    
    // Check if equipment exists and belongs to user's organization
    const existingEquipment = await prisma.equipment.findFirst({
      where: {
        id,
        organizationId
      }
    });

    if (!existingEquipment) {
      return next(new AppError('Equipment not found or you do not have permission to modify it', 404));
    }

    // Update the equipment
    const updatedEquipment = await prisma.equipment.update({
      where: { id },
      data: req.body
    });

    return res.status(200).json({
      status: 'success',
      data: updatedEquipment
    });
  } catch (error) {
    logger.error('Error updating equipment:', error);
    return next(new AppError('Failed to update equipment', 500));
  }
};

/**
 * Delete an equipment item
 */
exports.deleteEquipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;
    
    // Check if equipment exists and belongs to user's organization
    const existingEquipment = await prisma.equipment.findFirst({
      where: {
        id,
        organizationId
      },
      include: {
        photos: true
      }
    });

    if (!existingEquipment) {
      return next(new AppError('Equipment not found or you do not have permission to delete it', 404));
    }

    // Delete associated photos from S3 if they exist
    if (existingEquipment.photos && existingEquipment.photos.length > 0) {
      const deletePromises = existingEquipment.photos.map(photo => {
        const key = photo.photoUrl.split('/').pop();
        return s3.deleteObject({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: `equipment-photos/${key}`
        }).promise();
      });
      
      await Promise.all(deletePromises);
    }

    // Delete the equipment (cascade will handle related records)
    await prisma.equipment.delete({
      where: { id }
    });

    return res.status(200).json({
      status: 'success',
      message: 'Equipment deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting equipment:', error);
    return next(new AppError('Failed to delete equipment', 500));
  }
};

/**
 * Upload photos for an equipment item
 */
exports.uploadEquipmentPhotos = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;
    
    // Check if equipment exists and belongs to user's organization
    const existingEquipment = await prisma.equipment.findFirst({
      where: {
        id,
        organizationId
      }
    });

    if (!existingEquipment) {
      return next(new AppError('Equipment not found or you do not have permission to modify it', 404));
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return next(new AppError('No photos uploaded', 400));
    }

    // Upload each file to S3 and create database records
    const uploadPromises = req.files.map(async (file, index) => {
      const fileKey = `equipment-photos/${uuidv4()}-${file.originalname}`;
      
      // Upload to S3
      await s3.upload({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileKey,
        Body: fs.createReadStream(file.path),
        ContentType: file.mimetype
      }).promise();

      // Clean up temp file
      fs.unlinkSync(file.path);

      // Create photo record
      return prisma.equipmentPhoto.create({
        data: {
          equipmentId: id,
          photoUrl: `${process.env.AWS_S3_URL}/${fileKey}`,
          isPrimary: index === 0 // First photo is primary by default
        }
      });
    });

    const uploadedPhotos = await Promise.all(uploadPromises);

    return res.status(200).json({
      status: 'success',
      data: uploadedPhotos
    });
  } catch (error) {
    logger.error('Error uploading equipment photos:', error);
    return next(new AppError('Failed to upload equipment photos', 500));
  }
};

/**
 * Delete an equipment photo
 */
exports.deleteEquipmentPhoto = async (req, res, next) => {
  try {
    const { equipmentId, photoId } = req.params;
    const organizationId = req.user.organizationId;
    
    // Check if equipment exists and belongs to user's organization
    const existingEquipment = await prisma.equipment.findFirst({
      where: {
        id: equipmentId,
        organizationId
      }
    });

    if (!existingEquipment) {
      return next(new AppError('Equipment not found or you do not have permission to modify it', 404));
    }

    // Find the photo
    const photo = await prisma.equipmentPhoto.findFirst({
      where: {
        id: photoId,
        equipmentId
      }
    });

    if (!photo) {
      return next(new AppError('Photo not found', 404));
    }

    // Delete from S3
    const key = photo.photoUrl.split('/').pop();
    await s3.deleteObject({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `equipment-photos/${key}`
    }).promise();

    // Delete from database
    await prisma.equipmentPhoto.delete({
      where: { id: photoId }
    });

    // If it was a primary photo, set a new primary if any photos remain
    if (photo.isPrimary) {
      const remainingPhotos = await prisma.equipmentPhoto.findMany({
        where: { equipmentId },
        orderBy: { createdAt: 'asc' },
        take: 1
      });

      if (remainingPhotos.length > 0) {
        await prisma.equipmentPhoto.update({
          where: { id: remainingPhotos[0].id },
          data: { isPrimary: true }
        });
      }
    }

    return res.status(200).json({
      status: 'success',
      message: 'Photo deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting equipment photo:', error);
    return next(new AppError('Failed to delete equipment photo', 500));
  }
};

/**
 * Generate QR code for equipment
 */
exports.generateQRCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;
    
    // Check if equipment exists and belongs to user's organization
    const existingEquipment = await prisma.equipment.findFirst({
      where: {
        id,
        organizationId
      }
    });

    if (!existingEquipment) {
      return next(new AppError('Equipment not found or you do not have permission to access it', 404));
    }

    // Generate QR code data (URL to equipment detail page)
    const appUrl = process.env.APP_URL || 'https://app.musicgeartracker.com';
    const equipmentUrl = `${appUrl}/equipment/${id}`;
    
    // Generate QR code as data URL
    const qrDataURL = await qrcode.toDataURL(equipmentUrl);
    
    return res.status(200).json({
      status: 'success',
      data: {
        qrCode: qrDataURL,
        equipmentId: id,
        equipmentName: existingEquipment.name,
        url: equipmentUrl
      }
    });
  } catch (error) {
    logger.error('Error generating QR code:', error);
    return next(new AppError('Failed to generate QR code', 500));
  }
};

/**
 * Get equipment statistics
 */
exports.getEquipmentStatistics = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;

    // Get equipment counts by condition
    const conditionCounts = await prisma.equipment.groupBy({
      by: ['condition'],
      where: { organizationId },
      _count: true
    });

    // Get equipment counts by category
    const categoryCounts = await prisma.equipment.groupBy({
      by: ['categoryId'],
      where: { organizationId },
      _count: true
    });

    // Get category names
    const categories = await prisma.equipmentCategory.findMany({
      where: {
        id: {
          in: categoryCounts.map(c => c.categoryId)
        }
      },
      select: {
        id: true,
        name: true
      }
    });

    // Calculate total value
    const totalValueResult = await prisma.equipment.aggregate({
      where: { organizationId },
      _sum: {
        currentValue: true,
        purchasePrice: true
      }
    });

    // Format category data
    const categoryData = categoryCounts.map(cat => ({
      categoryId: cat.categoryId,
      categoryName: categories.find(c => c.id === cat.categoryId)?.name || 'Uncategorized',
      count: cat._count
    }));

    // Format condition data
    const conditionData = conditionCounts.map(cond => ({
      condition: cond.condition || 'UNKNOWN',
      count: cond._count
    }));

    return res.status(200).json({
      status: 'success',
      data: {
        totalEquipment: await prisma.equipment.count({ where: { organizationId } }),
        totalValue: totalValueResult._sum.currentValue || 0,
        totalPurchasePrice: totalValueResult._sum.purchasePrice || 0,
        byCondition: conditionData,
        byCategory: categoryData
      }
    });
  } catch (error) {
    logger.error('Error fetching equipment statistics:', error);
    return next(new AppError('Failed to fetch equipment statistics', 500));
  }
};

/**
 * Get all equipment categories
 */
exports.getAllCategories = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;

    const categories = await prisma.equipmentCategory.findMany({
      where: { organizationId },
      orderBy: { name: 'asc' }
    });

    return res.status(200).json({
      status: 'success',
      results: categories.length,
      data: categories
    });
  } catch (error) {
    logger.error('Error fetching categories:', error);
    return next(new AppError('Failed to fetch categories', 500));
  }
};

/**
 * Create a new equipment category
 */
exports.createCategory = async (req, res, next) => {
  try {
    const { name, parentCategoryId } = req.body;
    const organizationId = req.user.organizationId;

    // Check if category with same name already exists in organization
    const existingCategory = await prisma.equipmentCategory.findFirst({
      where: {
        name,
        organizationId
      }
    });

    if (existingCategory) {
      return next(new AppError('A category with this name already exists', 400));
    }

    // Create new category
    const newCategory = await prisma.equipmentCategory.create({
      data: {
        name,
        organizationId,
        parentCategoryId
      }
    });

    return res.status(201).json({
      status: 'success',
      data: newCategory
    });
  } catch (error) {
    logger.error('Error creating category:', error);
    return next(new AppError('Failed to create category', 500));
  }
};
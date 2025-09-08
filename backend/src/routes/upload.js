const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const uploadService = require('../services/uploadService');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/v1/upload/signed-url:
 *   post:
 *     summary: Generate signed URL for direct S3 upload
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 */
router.post('/signed-url', authenticateToken, async (req, res) => {
  try {
    const { fileName, contentType, folder = 'general' } = req.body;

    if (!fileName || !contentType) {
      return res.status(400).json({
        success: false,
        message: 'fileName and contentType are required'
      });
    }

    const result = await uploadService.generateSignedUploadUrl(
      fileName,
      contentType,
      req.user._id,
      folder
    );

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    logger.error('Generate signed URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate signed URL'
    });
  }
});

/**
 * @swagger
 * /api/v1/upload/single:
 *   post:
 *     summary: Upload single file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 */
router.post('/single',
  authenticateToken,
  uploadService.single('file', 'general'),
  async (req, res) => {
    try {
      const { uploadResult } = req;

      if (!uploadResult) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      res.json({
        success: true,
        message: 'File uploaded successfully',
        data: uploadResult
      });

    } catch (error) {
      logger.error('Single file upload error:', error);
      res.status(500).json({
        success: false,
        message: 'File upload failed'
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/upload/multiple:
 *   post:
 *     summary: Upload multiple files
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 */
router.post('/multiple',
  authenticateToken,
  uploadService.multiple('files', 5, 'general'),
  async (req, res) => {
    try {
      const { uploadResult } = req;

      if (!uploadResult) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      res.json({
        success: true,
        message: 'Files uploaded successfully',
        data: uploadResult
      });

    } catch (error) {
      logger.error('Multiple file upload error:', error);
      res.status(500).json({
        success: false,
        message: 'File upload failed'
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/upload/delete:
 *   delete:
 *     summary: Delete file from S3
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/delete', authenticateToken, async (req, res) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: 'File key is required'
      });
    }

    const result = await uploadService.deleteFromS3(key);

    res.json({
      success: true,
      message: 'File deleted successfully',
      data: result
    });

  } catch (error) {
    logger.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'File deletion failed'
    });
  }
});

module.exports = router;
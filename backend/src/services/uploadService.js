const AWS = require('aws-sdk');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const logger = require('../utils/logger');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET;

class UploadService {
  constructor() {
    // Configure multer for temporary file storage
    this.upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 5 // Maximum 5 files per request
      },
      fileFilter: this.fileFilter.bind(this)
    });
  }

  // File filter for multer
  fileFilter(req, file, cb) {
    const allowedTypes = {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    };

    if (allowedTypes[file.mimetype]) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'), false);
    }
  }

  // Generate unique filename
  generateFileName(originalName, userId, folder = 'general') {
    const extension = path.extname(originalName).toLowerCase();
    const timestamp = Date.now();
    const random = uuidv4().slice(0, 8);
    return `${folder}/${userId}/${timestamp}-${random}${extension}`;
  }

  // Upload file to S3
  async uploadToS3(file, userId, folder = 'general') {
    try {
      const fileName = this.generateFileName(file.originalname, userId, folder);
      
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
        Metadata: {
          'uploaded-by': userId,
          'upload-timestamp': new Date().toISOString()
        }
      };

      const result = await s3.upload(uploadParams).promise();
      
      logger.info(`File uploaded successfully: ${fileName}`);
      
      return {
        success: true,
        url: result.Location,
        key: result.Key,
        bucket: result.Bucket,
        size: file.size,
        mimetype: file.mimetype,
        originalName: file.originalname
      };

    } catch (error) {
      logger.error('S3 upload failed:', error);
      throw new Error('File upload failed');
    }
  }

  // Upload multiple files
  async uploadMultipleToS3(files, userId, folder = 'general') {
    try {
      const uploadPromises = files.map(file => 
        this.uploadToS3(file, userId, folder)
      );
      
      const results = await Promise.all(uploadPromises);
      
      return {
        success: true,
        files: results
      };

    } catch (error) {
      logger.error('Multiple file upload failed:', error);
      throw new Error('Multiple file upload failed');
    }
  }

  // Generate signed URL for direct upload (client-side upload)
  async generateSignedUploadUrl(fileName, contentType, userId, folder = 'general') {
    try {
      const key = this.generateFileName(fileName, userId, folder);
      
      const signedUrlExpireSeconds = 60 * 10; // 10 minutes
      
      const url = s3.getSignedUrl('putObject', {
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
        ACL: 'public-read',
        Expires: signedUrlExpireSeconds,
        Metadata: {
          'uploaded-by': userId,
          'upload-timestamp': new Date().toISOString()
        }
      });

      return {
        success: true,
        uploadUrl: url,
        key: key,
        publicUrl: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
      };

    } catch (error) {
      logger.error('Signed URL generation failed:', error);
      throw new Error('Failed to generate upload URL');
    }
  }

  // Delete file from S3
  async deleteFromS3(key) {
    try {
      await s3.deleteObject({
        Bucket: BUCKET_NAME,
        Key: key
      }).promise();

      logger.info(`File deleted successfully: ${key}`);
      return { success: true };

    } catch (error) {
      logger.error('S3 delete failed:', error);
      throw new Error('File deletion failed');
    }
  }

  // Get file metadata
  async getFileMetadata(key) {
    try {
      const result = await s3.headObject({
        Bucket: BUCKET_NAME,
        Key: key
      }).promise();

      return {
        success: true,
        metadata: {
          size: result.ContentLength,
          contentType: result.ContentType,
          lastModified: result.LastModified,
          etag: result.ETag,
          metadata: result.Metadata
        }
      };

    } catch (error) {
      logger.error('Get file metadata failed:', error);
      return { success: false, error: 'File not found' };
    }
  }

  // Middleware for single file upload
  single(fieldName, folder = 'general') {
    return (req, res, next) => {
      this.upload.single(fieldName)(req, res, async (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }

        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: 'No file uploaded'
          });
        }

        try {
          const result = await this.uploadToS3(req.file, req.user._id, folder);
          req.uploadResult = result;
          next();
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message
          });
        }
      });
    };
  }

  // Middleware for multiple file upload
  multiple(fieldName, maxCount = 5, folder = 'general') {
    return (req, res, next) => {
      this.upload.array(fieldName, maxCount)(req, res, async (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }

        if (!req.files || req.files.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'No files uploaded'
          });
        }

        try {
          const result = await this.uploadMultipleToS3(req.files, req.user._id, folder);
          req.uploadResult = result;
          next();
        } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message
          });
        }
      });
    };
  }
}

module.exports = new UploadService();
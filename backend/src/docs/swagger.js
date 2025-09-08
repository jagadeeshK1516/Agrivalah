const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AgriValah API',
      version: '1.0.0',
      description: 'AgriValah Backend API - Connecting farmers, customers, and agricultural ecosystem',
      contact: {
        name: 'AgriValah Team',
        email: 'api@agrivalah.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.agrivalah.com' 
          : 'http://localhost:8001',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            role: { 
              type: 'string',
              enum: ['customer', 'mitra', 'farmer', 'reseller', 'agritech_startup', 'service_provider', 'admin']
            },
            verified: { type: 'boolean' },
            profilePic: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            sellerId: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            unit: { type: 'string' },
            stock: { type: 'number' },
            category: { type: 'string' },
            organic: { type: 'boolean' },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  alt: { type: 'string' },
                  isPrimary: { type: 'boolean' }
                }
              }
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            orderNumber: { type: 'string' },
            buyerId: { type: 'string' },
            sellerId: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  productName: { type: 'string' },
                  quantity: { type: 'number' },
                  pricePerUnit: { type: 'number' },
                  totalPrice: { type: 'number' }
                }
              }
            },
            status: { type: 'string' },
            pricing: {
              type: 'object',
              properties: {
                subtotal: { type: 'number' },
                deliveryCharge: { type: 'number' },
                tax: { type: 'number' },
                total: { type: 'number' }
              }
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication information is missing or invalid',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        ForbiddenError: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        ValidationError: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Users',
        description: 'User profile management endpoints'
      },
      {
        name: 'Sellers',
        description: 'Seller registration and profile management'
      },
      {
        name: 'Products',
        description: 'Product management and marketplace endpoints'
      },
      {
        name: 'Orders',
        description: 'Order management and processing'
      },
      {
        name: 'Admin',
        description: 'Administrative endpoints'
      },
      {
        name: 'Upload',
        description: 'File upload and management'
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/models/*.js'
  ]
};

const swaggerDocs = swaggerJsdoc(options);

// Custom CSS for Swagger UI
const customCss = `
  .swagger-ui .topbar { display: none; }
  .swagger-ui .info { margin: 50px 0; }
  .swagger-ui .info .title { color: #16a34a; }
  .swagger-ui .scheme-container { background: #f8f9fa; padding: 20px; border-radius: 5px; }
`;

const swaggerUiOptions = {
  customCss,
  customSiteTitle: 'AgriValah API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    docExpansion: 'none'
  }
};

module.exports = {
  swaggerDocs,
  swaggerUi,
  swaggerUiOptions
};
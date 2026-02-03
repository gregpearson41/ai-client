const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TechLifeCorp Admin API',
      version: '1.0.0',
      description: 'REST API for TechLifeCorp Admin Dashboard with JWT Authentication and Role-Based Access Control',
      contact: {
        name: 'TechLifeCorp',
        email: 'support@techlifecorp.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            role: {
              type: 'string',
              enum: ['App Admin', 'Owner', 'Editor', 'Viewer'],
              description: 'User role'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the user account is active'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@techlifecorp.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'admin123'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            token: {
              type: 'string',
              description: 'JWT access token'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: {
              type: 'string',
              format: 'email'
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6
            },
            name: {
              type: 'string'
            },
            role: {
              type: 'string',
              enum: ['App Admin', 'Owner', 'Editor', 'Viewer'],
              default: 'Viewer'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

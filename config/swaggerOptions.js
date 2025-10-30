const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kyro Crypto Payment Platform API',
      version: '1.0.0',
      description: 'API documentation for the Kyro crypto payment platform',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      },
      {
        url: 'https://your-kyro-instance.com/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT or API Key',
          description: 'Enter your JWT token or API key in the format: Bearer {token} or Bearer {api_key}'
        }
      }
    }
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './config/swaggerComponents.js'
  ], // files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

module.exports = specs;
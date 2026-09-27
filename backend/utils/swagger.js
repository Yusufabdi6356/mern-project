import swaggerJSDoc from 'swagger-jsdoc';

const servers = [{ url: `http://localhost:${process.env.PORT || 3000}` }];

if (process.env.RENDER_URL) {
  servers.unshift({ url: process.env.RENDER_URL });
}

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Personal Finance Tracker API',
      version: '1.0.0',
      description: 'Track income and expenses, organize categories and view monthly summaries'
    },
    servers,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

export const swaggerSpec = swaggerJSDoc(options);

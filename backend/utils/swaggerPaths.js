export const paths = {
  '/upload/profile-picture': {
    post: {
      summary: 'Upload a profile picture to Cloudinary',
      tags: ['Upload'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                file: { type: 'string', format: 'binary' }
              }
            }
          }
        }
      },
      responses: {
        '201': { description: 'Returns the Cloudinary file URL' },
        '400': { description: 'No file uploaded' },
        '401': { description: 'No token provided' }
      }
    }
  },
  '/transactions': {
    post: {
      summary: 'Add a new income or expense',
      tags: ['Transactions'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title', 'amount', 'type', 'category'],
              properties: {
                title: { type: 'string', example: 'Groceries' },
                amount: { type: 'number', example: -50 },
                type: { type: 'string', enum: ['income', 'expense'], example: 'expense' },
                category: { type: 'string', example: 'Food' },
                date: { type: 'string', example: '2025-05-27' }
              }
            }
          }
        }
      },
      responses: {
        '201': { description: 'Transaction created' },
        '400': { description: 'Validation failed' }
      }
    },
    get: {
      summary: 'List all transactions for the logged-in user',
      tags: ['Transactions'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'query',
          name: 'type',
          schema: { type: 'string', enum: ['income', 'expense'] }
        },
        {
          in: 'query',
          name: 'category',
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': { description: 'A list of transactions' }
      }
    }
  },
  '/transactions/monthly-summary': {
    get: {
      summary: 'Total spent and earned per category for a month',
      tags: ['Transactions'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'query',
          name: 'month',
          description: 'Month in YYYY-MM format, defaults to the current month',
          schema: { type: 'string', example: '2025-05' }
        }
      ],
      responses: {
        '200': { description: 'Monthly totals grouped by category' },
        '400': { description: 'Month must be in YYYY-MM format' }
      }
    }
  },
  '/transactions/{id}': {
    put: {
      summary: 'Edit a transaction by ID',
      tags: ['Transactions'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          description: 'Transaction ID',
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                amount: { type: 'number' },
                type: { type: 'string', enum: ['income', 'expense'] },
                category: { type: 'string' },
                date: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        '200': { description: 'Transaction updated' },
        '404': { description: 'Transaction not found' }
      }
    },
    delete: {
      summary: 'Delete a transaction by ID',
      tags: ['Transactions'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          description: 'Transaction ID',
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': { description: 'Transaction deleted' },
        '404': { description: 'Transaction not found' }
      }
    }
  },
  '/categories': {
    get: {
      summary: 'List predefined and custom categories',
      tags: ['Categories'],
      security: [{ bearerAuth: [] }],
      responses: {
        '200': { description: 'A list of categories' }
      }
    },
    post: {
      summary: 'Create a custom category',
      tags: ['Categories'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'type'],
              properties: {
                name: { type: 'string', example: 'Gym' },
                type: { type: 'string', enum: ['income', 'expense'] }
              }
            }
          }
        }
      },
      responses: {
        '201': { description: 'Category created' },
        '409': { description: 'Category already exists' }
      }
    }
  },
  '/auth/register': {
    post: {
      summary: 'Register a new user',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'email', 'password'],
              properties: {
                name: { type: 'string', example: 'Yusuf' },
                email: { type: 'string', example: 'yusuf@gmail.com' },
                password: { type: 'string', example: 'Secret@123' }
              }
            }
          }
        }
      },
      responses: {
        '201': { description: 'User registered, returns JWT token' },
        '400': { description: 'Validation failed' },
        '409': { description: 'Email already registered' }
      }
    }
  },
  '/auth/login': {
    post: {
      summary: 'Log in a user',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', example: 'yusuf@gmail.com' },
                password: { type: 'string', example: 'Secret@123' }
              }
            }
          }
        }
      },
      responses: {
        '200': { description: 'Login successful, returns JWT token' },
        '401': { description: 'Invalid email or password' }
      }
    }
  },
  '/auth/profile': {
    get: {
      summary: 'Get current user profile',
      tags: ['Auth'],
      security: [{ bearerAuth: [] }],
      responses: {
        '200': { description: 'Current user info' },
        '401': { description: 'No token provided' }
      }
    }
  },
  '/admin/overview': {
    get: {
      summary: 'Total users, transactions and top spending categories',
      tags: ['Admin'],
      security: [{ bearerAuth: [] }],
      responses: {
        '200': { description: 'App overview' },
        '403': { description: 'Access denied' }
      }
    }
  }
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
exports.swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'REST API',
        version: '2.0.0',
        description: 'REST API for Users, Posts, Comments with JWT auth.'
    },
    servers: [{ url: 'http://localhost:3000' }],
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
                    id: { type: 'string' },
                    username: { type: 'string' },
                    email: { type: 'string' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' }
                }
            },
            Post: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    content: { type: 'string' },
                    authorId: { type: 'string' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' }
                }
            },
            Comment: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    content: { type: 'string' },
                    postId: { type: 'string' },
                    authorId: { type: 'string' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' }
                }
            },
            AuthTokens: {
                type: 'object',
                properties: {
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' }
                }
            },
            AuthResponse: {
                type: 'object',
                properties: {
                    user: { $ref: '#/components/schemas/User' },
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
            }
        }
    },
    paths: {
        '/auth/register': {
            post: {
                tags: ['Auth'],
                summary: 'Register a new user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['username', 'email', 'password'],
                                properties: {
                                    username: { type: 'string' },
                                    email: { type: 'string' },
                                    password: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'Registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
                    400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    409: { description: 'Email exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Login with email and password',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Logged in', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
                    401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/auth/refresh': {
            post: {
                tags: ['Auth'],
                summary: 'Refresh access token',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['refreshToken'],
                                properties: {
                                    refreshToken: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'New access token',
                        content: { 'application/json': { schema: { type: 'object', properties: { accessToken: { type: 'string' } } } } }
                    },
                    401: { description: 'Invalid refresh token', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/auth/logout': {
            post: {
                tags: ['Auth'],
                summary: 'Logout by revoking refresh token',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['refreshToken'],
                                properties: {
                                    refreshToken: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    204: { description: 'Logged out' },
                    400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/users': {
            get: {
                tags: ['Users'],
                summary: 'List users',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'User list', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } },
                    401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            },
            post: {
                tags: ['Users'],
                summary: 'Create user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['username', 'email', 'password'],
                                properties: {
                                    username: { type: 'string' },
                                    email: { type: 'string' },
                                    password: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                    409: { description: 'Email exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/users/{userId}': {
            get: {
                tags: ['Users'],
                summary: 'Get user by ID',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'User', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                    404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            },
            put: {
                tags: ['Users'],
                summary: 'Update user',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    username: { type: 'string' },
                                    email: { type: 'string' },
                                    password: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                    403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            },
            delete: {
                tags: ['Users'],
                summary: 'Delete user',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    204: { description: 'Deleted' },
                    403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/post': {
            get: {
                tags: ['Posts'],
                summary: 'List posts',
                parameters: [{ name: 'authorId', in: 'query', required: false, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Post list', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Post' } } } } }
                }
            },
            post: {
                tags: ['Posts'],
                summary: 'Create post',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['title', 'content'],
                                properties: {
                                    title: { type: 'string' },
                                    content: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } },
                    401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/post/{postId}': {
            get: {
                tags: ['Posts'],
                summary: 'Get post by ID',
                parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Post', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } },
                    404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            },
            put: {
                tags: ['Posts'],
                summary: 'Update post',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: { type: 'string' },
                                    content: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } },
                    403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            },
            delete: {
                tags: ['Posts'],
                summary: 'Delete post',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    204: { description: 'Deleted' },
                    403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/comment': {
            get: {
                tags: ['Comments'],
                summary: 'List comments',
                parameters: [{ name: 'postId', in: 'query', required: false, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Comment list', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Comment' } } } } }
                }
            },
            post: {
                tags: ['Comments'],
                summary: 'Create comment',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['postId', 'content'],
                                properties: {
                                    postId: { type: 'string' },
                                    content: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Comment' } } } },
                    404: { description: 'Post not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/comment/{commentId}': {
            get: {
                tags: ['Comments'],
                summary: 'Get comment by ID',
                parameters: [{ name: 'commentId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Comment', content: { 'application/json': { schema: { $ref: '#/components/schemas/Comment' } } } },
                    404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            },
            put: {
                tags: ['Comments'],
                summary: 'Update comment',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'commentId', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['content'],
                                properties: {
                                    content: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Comment' } } } },
                    403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            },
            delete: {
                tags: ['Comments'],
                summary: 'Delete comment',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'commentId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    204: { description: 'Deleted' },
                    403: { description: 'Forbidden', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        }
    }
};

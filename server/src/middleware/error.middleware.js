// Global error handler middleware
export const errorHandler = (error, request, reply) => {
  request.log.error(error);

  // Validation errors (Zod)
  if (error.validation) {
    return reply.status(400).send({
      success: false,
      error: 'Validation failed',
      details: error.validation
    });
  }

  // JWT errors
  if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER' || 
      error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID') {
    return reply.status(401).send({
      success: false,
      error: 'Invalid or missing authentication token'
    });
  }

  // Rate limit errors
  if (error.statusCode === 429) {
    return reply.status(429).send({
      success: false,
      error: 'Too many requests, please try again later'
    });
  }

  // Database errors
  if (error.code === 'P2002') { // Prisma unique constraint
    return reply.status(409).send({
      success: false,
      error: 'Resource already exists'
    });
  }

  if (error.code === 'P2025') { // Prisma record not found
    return reply.status(404).send({
      success: false,
      error: 'Resource not found'
    });
  }

  // Default server error
  const statusCode = error.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : error.message;

  return reply.status(statusCode).send({
    success: false,
    error: message
  });
};
// Authentication middleware for protected routes
export const authenticate = async (request, reply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return reply.status(401).send({ 
        success: false, 
        error: 'Authentication token required' 
      });
    }

    const decoded = await request.jwtVerify();
    request.user = decoded;
    
  } catch (error) {
    request.log.error(error, 'Authentication failed');
    return reply.status(401).send({ 
      success: false, 
      error: 'Invalid or expired token' 
    });
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (request, reply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (token) {
      const decoded = await request.jwtVerify();
      request.user = decoded;
    }
  } catch (error) {
    // Silently ignore auth errors for optional auth
    request.log.debug(error, 'Optional auth failed');
  }
};
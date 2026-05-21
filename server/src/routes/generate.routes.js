import { generateController, enhancePromptController } from '../controllers/generate.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

export default async function generateRoutes(fastify, options) {
  // Add authentication hook for all routes in this context
  fastify.addHook('preHandler', authenticate);

  fastify.post('/generate', generateController);
  fastify.post('/enhance-prompt', enhancePromptController);

  fastify.post('/regenerate', async (request, reply) => {
    // TODO: Implement regenerate functionality
    return { success: true, message: 'Regenerate endpoint - implementation pending' };
  });
}

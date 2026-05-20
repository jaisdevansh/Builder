import { z } from 'zod';
import { generateWebsite } from '../services/generation.service.js';

// Zod schema for request validation
const generateSchema = z.object({
  prompt: z.string().min(5, "Prompt is too short").max(1000, "Prompt is too long"),
});

export const generateController = async (request, reply) => {
  try {
    // 1. Validate Input
    const { prompt } = generateSchema.parse(request.body);

    // 2. Call Orchestrator Service
    request.log.info({ prompt, userId: request.user.id }, 'Starting website generation pipeline');
    const result = await generateWebsite(prompt, request.user.id);

    // 3. Return Payload
    return reply.status(200).send({
      success: true,
      data: result
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ success: false, error: error.errors[0].message });
    }
    
    // Handle quota/rate limit errors with user-friendly messages
    if (error.status === 429 || error.message?.includes('rate limit') || error.message?.includes('quota')) {
      request.log.warn(error, 'AI API rate limit reached');
      return reply.status(429).send({ 
        success: false, 
        error: 'AI service is temporarily at capacity. Please wait a moment and try again.',
        retryAfter: 30 // seconds
      });
    }
    
    request.log.error(error, 'Generation Controller Error');
    return reply.status(500).send({ 
      success: false, 
      error: 'Failed to generate website. Please try again in a moment.' 
    });
  }
};

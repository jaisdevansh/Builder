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

export const enhancePromptController = async (request, reply) => {
  try {
    const { prompt } = generateSchema.parse(request.body);

    request.log.info({ promptLength: prompt.length, userId: request.user?.id }, 'Starting prompt enhancement');
    
    // Import here or at top. Since it's a dynamic module, better to import at top, but we can do dynamic import to be safe if it's not exported. Wait, I should just import it at the top of the file using multi_replace.
    // Let me just dynamic import it here.
    const { enhanceUserPrompt } = await import('../ai/nvidia.service.js');
    
    const enhancedPrompt = await enhanceUserPrompt(prompt);

    return reply.status(200).send({
      success: true,
      data: { enhancedPrompt }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ success: false, error: error.errors[0].message });
    }
    
    request.log.error(error, 'Prompt Enhancement Controller Error');
    return reply.status(500).send({ 
      success: false, 
      error: 'Failed to enhance prompt. Please try again.' 
    });
  }
};

import { z } from 'zod';
import { editWebsiteFile } from '../services/edit.service.js';

// Zod schema for request validation
const editSchema = z.object({
  prompt: z.string().min(2, "Prompt is too short").max(10000, "Prompt is too long"),
  activeFile: z.string().default('/App.tsx'),
});

export const editController = async (request, reply) => {
  try {
    const { id } = request.params;
    const { prompt, activeFile } = editSchema.parse(request.body);

    request.log.info({ promptLength: prompt.length, projectId: id, activeFile, userId: request.user.id }, 'Starting file edit pipeline');
    
    const result = await editWebsiteFile(id, request.user.id, prompt, activeFile);

    return reply.status(200).send({
      success: true,
      data: result
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ success: false, error: error.issues?.[0]?.message || 'Invalid input parameters' });
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
    
    if (error.message === 'Project not found' || error.message === 'Unauthorized to edit this project') {
      return reply.status(404).send({ success: false, error: error.message });
    }

    request.log.error(error, 'Edit Controller Error');
    return reply.status(500).send({ 
      success: false, 
      error: 'Failed to edit file. Please try again in a moment.' 
    });
  }
};

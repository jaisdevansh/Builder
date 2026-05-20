import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(1).max(100),
  prompt: z.string().min(1).max(2000),
  theme: z.string().optional()
});

export const updateProjectSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  prompt: z.string().min(1).max(2000).optional(),
  theme: z.string().optional()
});

export const projectParamsSchema = z.object({
  id: z.string().uuid()
});

export const projectQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional()
});
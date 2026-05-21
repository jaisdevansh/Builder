import { 
  getProjects, 
  getProject, 
  updateProject, 
  deleteProject, 
  exportProject 
} from '../controllers/project.controller.js';
import { editController } from '../controllers/edit.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

export default async function projectRoutes(fastify, options) {
  // Add authentication hook for all routes in this context
  fastify.addHook('preHandler', authenticate);

  fastify.get('/projects', getProjects);
  fastify.get('/projects/:id', getProject);
  fastify.put('/projects/:id', updateProject);
  fastify.post('/projects/:id/edit', editController);
  fastify.delete('/projects/:id', deleteProject);
  fastify.get('/export/:projectId', exportProject);
}

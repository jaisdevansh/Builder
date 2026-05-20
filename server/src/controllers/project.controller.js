import prisma from '../db/prisma.js';
import { projectParamsSchema, projectQuerySchema, updateProjectSchema } from '../validators/project.validator.js';

export const getProjects = async (request, reply) => {
  try {
    const { page, limit, search } = projectQuerySchema.parse(request.query);
    const userId = request.user.id;

    const where = {
      user_id: userId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { prompt: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          files: {
            select: { id: true, file_name: true, file_type: true }
          },
          _count: {
            select: { files: true }
          }
        },
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.project.count({ where })
    ]);

    return {
      success: true,
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

  } catch (error) {
    request.log.error(error, 'Failed to fetch projects');
    return reply.status(500).send({
      success: false,
      error: 'Failed to fetch projects'
    });
  }
};

export const getProject = async (request, reply) => {
  try {
    const { id } = projectParamsSchema.parse(request.params);
    const userId = request.user.id;

    const project = await prisma.project.findFirst({
      where: { 
        id,
        user_id: userId 
      },
      include: {
        files: true,
        ai_generations: true
      }
    });

    if (!project) {
      return reply.status(404).send({
        success: false,
        error: 'Project not found'
      });
    }

    return {
      success: true,
      project
    };

  } catch (error) {
    request.log.error(error, 'Failed to fetch project');
    return reply.status(500).send({
      success: false,
      error: 'Failed to fetch project'
    });
  }
};

export const updateProject = async (request, reply) => {
  try {
    const { id } = projectParamsSchema.parse(request.params);
    const updateData = updateProjectSchema.parse(request.body);
    const userId = request.user.id;

    const project = await prisma.project.updateMany({
      where: { 
        id,
        user_id: userId 
      },
      data: updateData
    });

    if (project.count === 0) {
      return reply.status(404).send({
        success: false,
        error: 'Project not found'
      });
    }

    const updatedProject = await prisma.project.findUnique({
      where: { id },
      include: {
        files: true
      }
    });

    return {
      success: true,
      project: updatedProject
    };

  } catch (error) {
    request.log.error(error, 'Failed to update project');
    return reply.status(500).send({
      success: false,
      error: 'Failed to update project'
    });
  }
};

export const deleteProject = async (request, reply) => {
  try {
    const { id } = projectParamsSchema.parse(request.params);
    const userId = request.user.id;

    const project = await prisma.project.deleteMany({
      where: { 
        id,
        user_id: userId 
      }
    });

    if (project.count === 0) {
      return reply.status(404).send({
        success: false,
        error: 'Project not found'
      });
    }

    return {
      success: true,
      deleted: true
    };

  } catch (error) {
    request.log.error(error, 'Failed to delete project');
    return reply.status(500).send({
      success: false,
      error: 'Failed to delete project'
    });
  }
};

export const exportProject = async (request, reply) => {
  try {
    const { projectId } = projectParamsSchema.parse(request.params);
    const userId = request.user.id;

    const project = await prisma.project.findFirst({
      where: { 
        id: projectId,
        user_id: userId 
      },
      include: {
        files: true
      }
    });

    if (!project) {
      return reply.status(404).send({
        success: false,
        error: 'Project not found'
      });
    }

    // TODO: Implement ZIP file generation
    // For now, return project data as JSON
    return {
      success: true,
      project: {
        title: project.title,
        files: project.files.map(file => ({
          name: file.file_name,
          content: file.content,
          type: file.file_type
        }))
      },
      message: 'ZIP export not yet implemented - returning JSON data'
    };

  } catch (error) {
    request.log.error(error, 'Failed to export project');
    return reply.status(500).send({
      success: false,
      error: 'Failed to export project'
    });
  }
};
import { editWebsiteCode } from '../ai/index.js';
import prisma from '../db/prisma.js';

export const editWebsiteFile = async (projectId, userId, prompt, activeFile) => {
  // 1. Verify project ownership
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { files: true }
  });

  if (!project) {
    throw new Error('Project not found');
  }

  if (project.user_id !== userId) {
    throw new Error('Unauthorized to edit this project');
  }

  // 2. Find the target file to edit
  let targetFile = project.files.find(f => f.file_name === activeFile);
  
  if (!targetFile) {
    // Fallback: If activeFile not found, default to /App.tsx
    targetFile = project.files.find(f => f.file_name === '/App.tsx');
    if (!targetFile) {
      throw new Error(`File ${activeFile} not found in project`);
    }
  }

  const startTime = Date.now();

  // 3. AI Execution Phase
  let newCode;
  try {
    console.log(`[Edit] Attempting to edit ${targetFile.file_name} with AI...`);
    newCode = await editWebsiteCode(prompt, targetFile.content);
    console.log(`[Edit] Edit completed successfully.`);
  } catch (error) {
    console.error('[Edit] Fatal edit error:', error.message);
    throw error;
  }
  
  const editTime = Date.now() - startTime;

  // 4. Update Database
  await prisma.file.update({
    where: { id: targetFile.id },
    data: { content: newCode }
  });

  // Track AI generation metrics for the edit
  await prisma.aIGeneration.create({
    data: {
      project_id: project.id,
      provider: 'gemini', // or dynamically get provider
      tokens_used: 1000, // rough estimate or get from AI router
      generation_time: editTime
    }
  });

  return {
    file_name: targetFile.file_name,
    code: newCode,
    editTime
  };
};

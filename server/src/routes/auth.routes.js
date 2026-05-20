import {
  googleLogin,
  googleCallback,
  githubCallback,
  emailSignup,
  emailLogin,
} from '../controllers/auth.controller.js';
import prisma from '../db/prisma.js';

export default async function authRoutes(fastify, options) {
  // ── Google ──────────────────────────────────────────
  // POST /api/auth/google  — verify Google ID token (@react-oauth/google)
  fastify.post('/auth/google', googleLogin);

  // POST /api/auth/google/callback  — exchange OAuth code for token
  fastify.post('/auth/google/callback', googleCallback);

  // ── GitHub ──────────────────────────────────────────
  // POST /api/auth/github/callback  — exchange OAuth code for token
  fastify.post('/auth/github/callback', githubCallback);

  // ── Email / Password ────────────────────────────────
  // POST /api/auth/signup
  fastify.post('/auth/signup', emailSignup);

  // POST /api/auth/login
  fastify.post('/auth/login', emailLogin);

  // ── Protected helpers ───────────────────────────────
  fastify.get('/auth/status', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: request.user.id },
        select: { id: true, name: true, email: true, image: true, provider: true }
      });
      
      if (!user) {
        return reply.status(401).send({ success: false, error: 'User not found' });
      }
      
      return { success: true, user };
    } catch (error) {
      request.log.error(error, 'Error fetching user status');
      return reply.status(500).send({ success: false, error: 'Failed to fetch user status' });
    }
  });

  fastify.post('/auth/logout', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    // JWT is stateless — client removes the token
    return { success: true, message: 'Logged out successfully' };
  });

  fastify.post('/auth/refresh', async (request, reply) => {
    return { success: true, message: 'Token refresh not yet implemented' };
  });
}
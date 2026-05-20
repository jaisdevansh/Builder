import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import prisma from '../db/prisma.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5174';

async function issueJwt(reply, user) {
  return reply.jwtSign({ id: user.id, email: user.email }, { expiresIn: '7d' });
}

// ─────────────────────────────────────────────
// GOOGLE — ID-Token flow (used by @react-oauth/google)
// ─────────────────────────────────────────────
export const googleLogin = async (request, reply) => {
  const { credential } = request.body;
  if (!credential) {
    return reply.status(400).send({ success: false, error: 'Credential token is required' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, picture } = ticket.getPayload();

    const user = await prisma.user.upsert({
      where: { email },
      update: { name: name || email.split('@')[0], image: picture, provider: 'google' },
      create: { email, name: name || email.split('@')[0], image: picture, provider: 'google' },
    });

    const token = await issueJwt(reply, user);
    return { success: true, user: safeUser(user), token };
  } catch (error) {
    request.log.error(error, 'Google ID-token auth error');
    return reply.status(401).send({ success: false, error: 'Invalid Google token' });
  }
};

// ─────────────────────────────────────────────
// GOOGLE — OAuth Code flow (redirect callback)
// ─────────────────────────────────────────────
export const googleCallback = async (request, reply) => {
  const { code } = request.body;
  if (!code) {
    return reply.status(400).send({ success: false, error: 'Authorization code is required' });
  }

  try {
    const redirectUri = `${FRONTEND_URL}/auth/callback`;

    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    });

    const { access_token } = tokenRes.data;
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
    );
    const { email, name, picture } = userRes.data;

    const user = await prisma.user.upsert({
      where: { email },
      update: { name: name || email.split('@')[0], image: picture, provider: 'google' },
      create: { email, name: name || email.split('@')[0], image: picture, provider: 'google' },
    });

    const token = await issueJwt(reply, user);
    return { success: true, user: safeUser(user), token };
  } catch (error) {
    const errorData = error.response?.data || error.message;
    request.log.error({ error: errorData }, 'Google OAuth callback error');
    return reply.status(401).send({ 
      success: false, 
      error: 'OAuth authentication failed',
      details: process.env.NODE_ENV === 'development' ? errorData : undefined
    });
  }
};

// ─────────────────────────────────────────────
// GITHUB — OAuth Code flow
// ─────────────────────────────────────────────
export const githubCallback = async (request, reply) => {
  const { code } = request.body;
  if (!code) {
    return reply.status(400).send({ success: false, error: 'Authorization code is required' });
  }

  try {
    // Exchange code for access token
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const { access_token, error: ghError } = tokenRes.data;
    if (ghError || !access_token) {
      throw new Error(ghError || 'No access token returned from GitHub');
    }

    // Fetch user profile
    const [userRes, emailRes] = await Promise.all([
      axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
      axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
    ]);

    const githubUser = userRes.data;
    // Pick primary verified email
    const primaryEmail =
      emailRes.data.find((e) => e.primary && e.verified)?.email ||
      emailRes.data[0]?.email ||
      `${githubUser.login}@github.local`;

    const name = githubUser.name || githubUser.login;
    const image = githubUser.avatar_url;

    const user = await prisma.user.upsert({
      where: { email: primaryEmail },
      update: { name, image, provider: 'github' },
      create: { email: primaryEmail, name, image, provider: 'github' },
    });

    const token = await issueJwt(reply, user);
    return { success: true, user: safeUser(user), token };
  } catch (error) {
    const errorData = error.response?.data || error.message;
    request.log.error({ error: errorData }, 'GitHub OAuth callback error');
    return reply.status(401).send({ 
      success: false, 
      error: 'GitHub authentication failed',
      details: process.env.NODE_ENV === 'development' ? errorData : undefined
    });
  }
};

// ─────────────────────────────────────────────
// EMAIL — Signup
// ─────────────────────────────────────────────
export const emailSignup = async (request, reply) => {
  const { name, email, password } = request.body;

  if (!email || !password) {
    return reply.status(400).send({ success: false, error: 'Email and password are required' });
  }
  if (password.length < 8) {
    return reply.status(400).send({ success: false, error: 'Password must be at least 8 characters' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return reply.status(409).send({ success: false, error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        password: hashedPassword,
        provider: 'email',
      },
    });

    const token = await issueJwt(reply, user);
    return reply.status(201).send({ success: true, user: safeUser(user), token });
  } catch (error) {
    request.log.error(error, 'Email signup error');
    return reply.status(500).send({ success: false, error: 'Signup failed. Please try again.' });
  }
};

// ─────────────────────────────────────────────
// EMAIL — Login
// ─────────────────────────────────────────────
export const emailLogin = async (request, reply) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return reply.status(400).send({ success: false, error: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return reply.status(401).send({ success: false, error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return reply.status(401).send({ success: false, error: 'Invalid email or password' });
    }

    const token = await issueJwt(reply, user);
    return { success: true, user: safeUser(user), token };
  } catch (error) {
    request.log.error(error, 'Email login error');
    return reply.status(500).send({ success: false, error: 'Login failed. Please try again.' });
  }
};

// ─────────────────────────────────────────────
// HELPER — strip password from user object
// ─────────────────────────────────────────────
function safeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

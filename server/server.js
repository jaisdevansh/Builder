import 'dotenv/config';

// Verify DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  console.error('❌ FATAL: DATABASE_URL is not set in environment variables!');
  console.error('Check that server/.env file exists and contains DATABASE_URL');
  process.exit(1);
}

console.log('✅ DATABASE_URL loaded successfully');

import buildApp from './src/app.js';

const startServer = async () => {
  try {
    const app = await buildApp();
    const port = process.env.PORT || 3001;
    
    await app.listen({ port, host: '0.0.0.0' });
    app.log.info(`🚀 Buildify AI Backend running on http://localhost:${port}`);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

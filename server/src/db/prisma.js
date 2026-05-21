import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { PrismaClient } from '@prisma/client';
import dns from 'dns/promises';
import 'dotenv/config';

let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL is not set in prisma.js');
  throw new Error('DATABASE_URL is not set. Check your .env file!');
}

let poolConfig = { connectionString };

// Robust DNS Bypass for Neon endpoints (Fixes local ISP/OS DNS blocking)
try {
  if (connectionString.includes('.neon.tech')) {
    const url = new URL(connectionString);
    const hostname = url.hostname;
    
    // Test if normal OS DNS works first
    try {
      await dns.lookup(hostname);
    } catch (osDnsError) {
      console.warn(`⚠️ OS DNS failed to resolve ${hostname}. Falling back to Google DNS...`);
      
      const resolver = new dns.Resolver();
      resolver.setServers(['8.8.8.8', '1.1.1.1']);
      const addresses = await resolver.resolve4(hostname);
      
      if (addresses.length > 0) {
        console.log(`✅ [Neon DNS Bypass] Resolved ${hostname} to ${addresses[0]}`);
        url.hostname = addresses[0];
        
        // Neon requires the endpoint ID when connecting via raw IP
        const endpointId = hostname.split('.')[0];
        url.searchParams.set('options', `endpoint=${endpointId}`);
        
        poolConfig = {
          connectionString: url.toString(),
          ssl: {
            servername: hostname, // Required for SNI routing
            rejectUnauthorized: true
          }
        };
      }
    }
  }
} catch (err) {
  console.warn('⚠️ [Neon DNS Bypass] Failed to apply DNS bypass:', err.message);
}

// Log connection string (masked)
const maskedUrl = poolConfig.connectionString.replace(/:[^@:]+@/, ':****@');
console.log(`📡 Prisma attempting to connect with (pg adapter): ${maskedUrl}`);

poolConfig.connectionTimeoutMillis = 30000;
poolConfig.idleTimeoutMillis = 300000;
poolConfig.max = 10;
poolConfig.keepAlive = true;

const pool = new pg.Pool(poolConfig);
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Test connection
prisma.$connect()
  .then(() => console.log('🟢 Prisma Client (pg) connected successfully'))
  .catch((err) => console.error('🔴 Prisma Client (pg) failed to connect:', err.message));

export default prisma;

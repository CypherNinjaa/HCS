import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000').transform((val) => parseInt(val, 10)),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  COOKIE_NAME: z.string().default('hcs-auth-token'),
  COOKIE_SECURE: z.string().default('false').transform((val) => val === 'true'),
  NODE_ENV: z.string().default('development'),
});

// Validate environment variables
const envResult = envSchema.safeParse(process.env);

if (!envResult.success) {
  console.error('❌ Invalid environment variables:', envResult.error.format());
  process.exit(1);
}

export const env = envResult.data;

// Export for use in other modules
export default env;

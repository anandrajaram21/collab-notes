import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);

async function cleanup() {
  try {
    // Drop tables if they exist, one at a time
    await sql`DROP TABLE IF EXISTS connected_users CASCADE`;
    await sql`DROP TABLE IF EXISTS notes CASCADE`;
    console.log("Tables dropped successfully");
  } catch (error) {
    console.error("Error dropping tables:", error);
  }
}

cleanup(); 
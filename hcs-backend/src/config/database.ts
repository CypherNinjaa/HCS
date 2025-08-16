import { Pool } from "pg";
import { env } from "./env";

// Create PostgreSQL connection pool
export const pool = new Pool({
	connectionString: env.DATABASE_URL,
	max: 20, // Maximum number of clients in the pool
	idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
	connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Test connection and log status
pool.on("connect", (client) => {
	console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err, client) => {
	console.error("❌ PostgreSQL pool error:", err);
	process.exit(-1);
});

// Graceful shutdown
process.on("SIGINT", async () => {
	console.log("🔄 Closing PostgreSQL pool...");
	await pool.end();
	console.log("✅ PostgreSQL pool closed");
	process.exit(0);
});

export default pool;

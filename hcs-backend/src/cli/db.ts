#!/usr/bin/env ts-node

import { migrationRunner } from "../database/migration-runner";
import logger from "../utils/logger";

async function main() {
	const command = process.argv[2];

	try {
		switch (command) {
			case "migrate":
				await migrationRunner.runMigrations();
				break;

			case "validate":
				const isValid = await migrationRunner.validateMigrations();
				process.exit(isValid ? 0 : 1);
				break;

			case "status":
				const status = await migrationRunner.getStatus();
				console.log("\n📊 Migration Status:");
				console.log(`  Total migrations: ${status.total}`);
				console.log(`  Executed: ${status.executed}`);
				console.log(`  Pending: ${status.pending}`);
				console.log(`  Last batch: ${status.lastBatch}\n`);
				break;

			default:
				console.log("\n🔧 Database Migration CLI\n");
				console.log("Usage: npm run db <command>\n");
				console.log("Commands:");
				console.log("  migrate   - Run pending migrations");
				console.log("  validate  - Validate migration file integrity");
				console.log("  status    - Show migration status\n");
				break;
		}

		process.exit(0);
	} catch (error) {
		logger.error({ error }, "Database command failed");
		process.exit(1);
	}
}

main();

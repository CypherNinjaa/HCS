import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { pool } from "../config/database";
import logger from "../utils/logger";

interface Migration {
	filename: string;
	content: string;
	checksum: string;
}

interface MigrationRecord {
	id: number;
	filename: string;
	batch: number;
	executed_at: Date;
	execution_time_ms: number;
	checksum: string;
	success: boolean;
	error_message?: string;
}

export class MigrationRunner {
	private migrationsPath: string;

	constructor() {
		this.migrationsPath = path.join(process.cwd(), "database", "migrations");
	}

	/**
	 * Calculate SHA-256 checksum of file content
	 */
	private calculateChecksum(content: string): string {
		return crypto.createHash("sha256").update(content).digest("hex");
	}

	/**
	 * Read all migration files from the migrations directory
	 */
	private async readMigrationFiles(): Promise<Migration[]> {
		try {
			const files = await fs.readdir(this.migrationsPath);
			const sqlFiles = files
				.filter((file) => file.endsWith(".sql"))
				.filter((file) => file !== "000_create_migrations_table.sql") // Exclude migrations table file
				.sort(); // Important: ensure consistent ordering

			const migrations: Migration[] = [];

			for (const filename of sqlFiles) {
				const filePath = path.join(this.migrationsPath, filename);
				const content = await fs.readFile(filePath, "utf-8");
				const checksum = this.calculateChecksum(content);

				migrations.push({
					filename,
					content,
					checksum,
				});
			}

			return migrations;
		} catch (error) {
			logger.error({ error }, "Failed to read migration files");
			throw new Error("Could not read migration files");
		}
	}

	/**
	 * Get executed migrations from database
	 */
	private async getExecutedMigrations(): Promise<MigrationRecord[]> {
		try {
			const result = await pool.query(`
        SELECT id, filename, batch, executed_at, execution_time_ms, 
               checksum, success, error_message
        FROM migrations 
        ORDER BY id ASC
      `);
			return result.rows;
		} catch (error) {
			// If migrations table doesn't exist, return empty array
			if ((error as any).code === "42P01") {
				return [];
			}
			throw error;
		}
	}

	/**
	 * Create migrations table if it doesn't exist
	 */
	private async ensureMigrationsTable(): Promise<void> {
		const migrationTableFile = path.join(
			this.migrationsPath,
			"000_create_migrations_table.sql"
		);

		try {
			const content = await fs.readFile(migrationTableFile, "utf-8");
			await pool.query(content);
			logger.info("Migrations table created");
		} catch (error) {
			if ((error as any).code !== "42P07") {
				// Table already exists
				logger.error({ error }, "Failed to create migrations table");
				throw error;
			}
		}
	}

	/**
	 * Execute a single migration
	 */
	private async executeMigration(
		migration: Migration,
		batch: number
	): Promise<void> {
		const startTime = Date.now();
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			// Execute the migration content
			await client.query(migration.content);

			const executionTime = Date.now() - startTime;

			// Record the migration execution
			await client.query(
				`
        INSERT INTO migrations (filename, batch, execution_time_ms, checksum, success)
        VALUES ($1, $2, $3, $4, $5)
      `,
				[migration.filename, batch, executionTime, migration.checksum, true]
			);

			await client.query("COMMIT");

			logger.info(
				{
					filename: migration.filename,
					executionTime,
					batch,
				},
				"Migration executed successfully"
			);
		} catch (error) {
			await client.query("ROLLBACK");

			// Record the failed migration
			const executionTime = Date.now() - startTime;
			await client.query(
				`
        INSERT INTO migrations (filename, batch, execution_time_ms, checksum, success, error_message)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
				[
					migration.filename,
					batch,
					executionTime,
					migration.checksum,
					false,
					(error as Error).message,
				]
			);

			logger.error(
				{
					error: (error as Error).message,
					filename: migration.filename,
				},
				"Migration failed"
			);

			throw error;
		} finally {
			client.release();
		}
	}

	/**
	 * Run pending migrations
	 */
	async runMigrations(): Promise<void> {
		try {
			logger.info("Starting database migrations...");

			// Ensure migrations table exists
			await this.ensureMigrationsTable();

			// Read all migration files
			const migrations = await this.readMigrationFiles();
			const executedMigrations = await this.getExecutedMigrations();

			// Get the highest batch number
			const lastBatch =
				executedMigrations.length > 0
					? Math.max(...executedMigrations.map((m) => m.batch))
					: 0;

			// Filter out already executed migrations
			const executedFilenames = new Set(
				executedMigrations.map((m) => m.filename)
			);
			const pendingMigrations = migrations.filter(
				(m) => !executedFilenames.has(m.filename)
			);

			if (pendingMigrations.length === 0) {
				logger.info("No pending migrations");
				return;
			}

			// Execute pending migrations in the next batch
			const newBatch = lastBatch + 1;

			logger.info(
				{
					pendingCount: pendingMigrations.length,
					batch: newBatch,
				},
				"Executing pending migrations"
			);

			for (const migration of pendingMigrations) {
				await this.executeMigration(migration, newBatch);
			}

			logger.info(
				{
					executedCount: pendingMigrations.length,
					batch: newBatch,
				},
				"All migrations completed successfully"
			);
		} catch (error) {
			logger.error({ error }, "Migration execution failed");
			throw error;
		}
	}

	/**
	 * Validate migration checksums (detect modified files)
	 */
	async validateMigrations(): Promise<boolean> {
		try {
			const migrations = await this.readMigrationFiles();
			const executedMigrations = await this.getExecutedMigrations();

			const issues: string[] = [];

			for (const executed of executedMigrations) {
				const current = migrations.find(
					(m) => m.filename === executed.filename
				);

				if (!current) {
					issues.push(`Migration file missing: ${executed.filename}`);
				} else if (current.checksum !== executed.checksum) {
					issues.push(`Migration file modified: ${executed.filename}`);
				}
			}

			if (issues.length > 0) {
				logger.error({ issues }, "Migration validation failed");
				return false;
			}

			logger.info("All migrations validated successfully");
			return true;
		} catch (error) {
			logger.error({ error }, "Migration validation error");
			return false;
		}
	}

	/**
	 * Get migration status
	 */
	async getStatus(): Promise<{
		total: number;
		executed: number;
		pending: number;
		lastBatch: number;
	}> {
		const migrations = await this.readMigrationFiles();
		const executedMigrations = await this.getExecutedMigrations();

		const lastBatch =
			executedMigrations.length > 0
				? Math.max(...executedMigrations.map((m) => m.batch))
				: 0;

		return {
			total: migrations.length,
			executed: executedMigrations.length,
			pending: migrations.length - executedMigrations.length,
			lastBatch,
		};
	}
}

export const migrationRunner = new MigrationRunner();

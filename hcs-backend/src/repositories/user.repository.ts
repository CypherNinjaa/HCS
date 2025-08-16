import { Pool, PoolClient } from "pg";
import {
	User,
	CreateUserData,
	UpdateUserData,
	UserRole,
	UserStatus,
	PaginationOptions,
	PaginationResult,
} from "../types/database";
import { pool } from "../config/database";
import logger from "../utils/logger";

export class UserRepository {
	private pool: Pool;

	constructor() {
		this.pool = pool;
	}

	/**
	 * Create a new user
	 */
	async create(userData: CreateUserData, client?: PoolClient): Promise<User> {
		const dbClient = client || this.pool;

		try {
			const query = `
        INSERT INTO users (email, password_hash, role, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

			const values = [
				userData.email,
				userData.password_hash,
				userData.role,
				userData.status || "pending_verification",
			];

			const result = await dbClient.query(query, values);

			logger.info(
				{
					userId: result.rows[0].id,
					email: userData.email,
					role: userData.role,
				},
				"User created successfully"
			);

			return result.rows[0];
		} catch (error) {
			logger.error({ error, email: userData.email }, "Failed to create user");
			throw error;
		}
	}

	/**
	 * Find user by ID
	 */
	async findById(id: string, client?: PoolClient): Promise<User | null> {
		const dbClient = client || this.pool;

		try {
			const query = `
        SELECT * FROM users 
        WHERE id = $1 AND deleted_at IS NULL
      `;

			const result = await dbClient.query(query, [id]);
			return result.rows[0] || null;
		} catch (error) {
			logger.error({ error, userId: id }, "Failed to find user by ID");
			throw error;
		}
	}

	/**
	 * Find user by email
	 */
	async findByEmail(email: string, client?: PoolClient): Promise<User | null> {
		const dbClient = client || this.pool;

		try {
			const query = `
        SELECT * FROM users 
        WHERE email = $1 AND deleted_at IS NULL
      `;

			const result = await dbClient.query(query, [email]);
			return result.rows[0] || null;
		} catch (error) {
			logger.error({ error, email }, "Failed to find user by email");
			throw error;
		}
	}

	/**
	 * Update user by ID
	 */
	async updateById(
		id: string,
		updateData: UpdateUserData,
		client?: PoolClient
	): Promise<User | null> {
		const dbClient = client || this.pool;

		try {
			const fields = Object.keys(updateData);
			const values = Object.values(updateData);

			if (fields.length === 0) {
				throw new Error("No fields to update");
			}

			const setClause = fields
				.map((field, index) => `${field} = $${index + 2}`)
				.join(", ");

			const query = `
        UPDATE users 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING *
      `;

			const result = await dbClient.query(query, [id, ...values]);

			if (result.rows[0]) {
				logger.info(
					{
						userId: id,
						updatedFields: fields,
					},
					"User updated successfully"
				);
			}

			return result.rows[0] || null;
		} catch (error) {
			logger.error({ error, userId: id }, "Failed to update user");
			throw error;
		}
	}

	/**
	 * Soft delete user by ID
	 */
	async deleteById(id: string, client?: PoolClient): Promise<boolean> {
		const dbClient = client || this.pool;

		try {
			const query = `
        UPDATE users 
        SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
      `;

			const result = await dbClient.query(query, [id]);

			if (result.rowCount && result.rowCount > 0) {
				logger.info({ userId: id }, "User soft deleted successfully");
				return true;
			}

			return false;
		} catch (error) {
			logger.error({ error, userId: id }, "Failed to delete user");
			throw error;
		}
	}

	/**
	 * Find users with pagination and filtering
	 */
	async findMany(
		filters: {
			role?: UserRole;
			status?: UserStatus;
			search?: string;
		} = {},
		pagination: PaginationOptions = {}
	): Promise<PaginationResult<User>> {
		try {
			const {
				page = 1,
				limit = 10,
				sortBy = "created_at",
				sortOrder = "DESC",
			} = pagination;

			const offset = (page - 1) * limit;

			// Build WHERE clause
			const whereConditions = ["deleted_at IS NULL"];
			const queryParams: any[] = [];
			let paramCounter = 1;

			if (filters.role) {
				whereConditions.push(`role = $${paramCounter}`);
				queryParams.push(filters.role);
				paramCounter++;
			}

			if (filters.status) {
				whereConditions.push(`status = $${paramCounter}`);
				queryParams.push(filters.status);
				paramCounter++;
			}

			if (filters.search) {
				whereConditions.push(`email ILIKE $${paramCounter}`);
				queryParams.push(`%${filters.search}%`);
				paramCounter++;
			}

			const whereClause = whereConditions.join(" AND ");

			// Count total records
			const countQuery = `SELECT COUNT(*) FROM users WHERE ${whereClause}`;
			const countResult = await this.pool.query(countQuery, queryParams);
			const total = parseInt(countResult.rows[0].count);

			// Fetch paginated data
			const dataQuery = `
        SELECT * FROM users 
        WHERE ${whereClause}
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT $${paramCounter} OFFSET $${paramCounter + 1}
      `;

			const dataResult = await this.pool.query(dataQuery, [
				...queryParams,
				limit,
				offset,
			]);

			const totalPages = Math.ceil(total / limit);

			return {
				data: dataResult.rows,
				pagination: {
					page,
					limit,
					total,
					totalPages,
					hasNext: page < totalPages,
					hasPrev: page > 1,
				},
			};
		} catch (error) {
			logger.error({ error, filters, pagination }, "Failed to find users");
			throw error;
		}
	}

	/**
	 * Update login tracking
	 */
	async updateLoginTracking(
		id: string,
		ipAddress: string,
		success: boolean,
		client?: PoolClient
	): Promise<void> {
		const dbClient = client || this.pool;

		try {
			if (success) {
				// Reset failed attempts and update last login
				const query = `
          UPDATE users 
          SET 
            last_login_at = CURRENT_TIMESTAMP,
            last_login_ip = $2,
            failed_login_attempts = 0,
            locked_until = NULL,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
        `;
				await dbClient.query(query, [id, ipAddress]);
			} else {
				// Increment failed attempts
				const query = `
          UPDATE users 
          SET 
            failed_login_attempts = failed_login_attempts + 1,
            locked_until = CASE 
              WHEN failed_login_attempts + 1 >= 5 
              THEN CURRENT_TIMESTAMP + INTERVAL '30 minutes'
              ELSE locked_until
            END,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
        `;
				await dbClient.query(query, [id]);
			}

			logger.info(
				{
					userId: id,
					success,
					ipAddress,
				},
				"Login tracking updated"
			);
		} catch (error) {
			logger.error({ error, userId: id }, "Failed to update login tracking");
			throw error;
		}
	}

	/**
	 * Check if user account is locked
	 */
	async isAccountLocked(id: string, client?: PoolClient): Promise<boolean> {
		const dbClient = client || this.pool;

		try {
			const query = `
        SELECT locked_until FROM users 
        WHERE id = $1 AND deleted_at IS NULL
      `;

			const result = await dbClient.query(query, [id]);

			if (!result.rows[0]) {
				return false;
			}

			const lockedUntil = result.rows[0].locked_until;

			if (!lockedUntil) {
				return false;
			}

			return new Date(lockedUntil) > new Date();
		} catch (error) {
			logger.error(
				{ error, userId: id },
				"Failed to check account lock status"
			);
			throw error;
		}
	}

	/**
	 * Unlock user account (admin action)
	 */
	async unlockAccount(id: string, client?: PoolClient): Promise<boolean> {
		const dbClient = client || this.pool;

		try {
			const query = `
        UPDATE users 
        SET 
          failed_login_attempts = 0,
          locked_until = NULL,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
      `;

			const result = await dbClient.query(query, [id]);

			if (result.rowCount && result.rowCount > 0) {
				logger.info({ userId: id }, "Account unlocked successfully");
				return true;
			}

			return false;
		} catch (error) {
			logger.error({ error, userId: id }, "Failed to unlock account");
			throw error;
		}
	}
}

export const userRepository = new UserRepository();

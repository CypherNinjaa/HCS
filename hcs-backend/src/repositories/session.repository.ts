import { Pool, PoolClient } from "pg";
import {
	Session,
	CreateSessionData,
	PaginationOptions,
	PaginationResult,
} from "../types/database";
import { pool } from "../config/database";
import logger from "../utils/logger";

export class SessionRepository {
	private pool: Pool;

	constructor() {
		this.pool = pool;
	}

	/**
	 * Create a new session
	 */
	async create(
		sessionData: CreateSessionData,
		client?: PoolClient
	): Promise<Session> {
		const dbClient = client || this.pool;

		try {
			const query = `
        INSERT INTO sessions (
          user_id, token_hash, refresh_token_hash, device_info,
          ip_address, user_agent, expires_at, refresh_expires_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;

			const values = [
				sessionData.user_id,
				sessionData.token_hash,
				sessionData.refresh_token_hash || null,
				sessionData.device_info
					? JSON.stringify(sessionData.device_info)
					: null,
				sessionData.ip_address || null,
				sessionData.user_agent || null,
				sessionData.expires_at,
				sessionData.refresh_expires_at || null,
			];

			const result = await dbClient.query(query, values);

			logger.info(
				{
					sessionId: result.rows[0].id,
					userId: sessionData.user_id,
					ipAddress: sessionData.ip_address,
				},
				"Session created successfully"
			);

			return result.rows[0];
		} catch (error) {
			logger.error(
				{ error, userId: sessionData.user_id },
				"Failed to create session"
			);
			throw error;
		}
	}

	/**
	 * Find session by ID
	 */
	async findById(id: string, client?: PoolClient): Promise<Session | null> {
		const dbClient = client || this.pool;

		try {
			const query = `SELECT * FROM sessions WHERE id = $1`;
			const result = await dbClient.query(query, [id]);
			return result.rows[0] || null;
		} catch (error) {
			logger.error({ error, sessionId: id }, "Failed to find session by ID");
			throw error;
		}
	}

	/**
	 * Find active session by token hash
	 */
	async findByTokenHash(
		tokenHash: string,
		client?: PoolClient
	): Promise<Session | null> {
		const dbClient = client || this.pool;

		try {
			const query = `
        SELECT * FROM sessions 
        WHERE token_hash = $1 
          AND is_active = true 
          AND expires_at > CURRENT_TIMESTAMP
          AND revoked_at IS NULL
      `;

			const result = await dbClient.query(query, [tokenHash]);
			return result.rows[0] || null;
		} catch (error) {
			logger.error({ error }, "Failed to find session by token hash");
			throw error;
		}
	}

	/**
	 * Find active session by refresh token hash
	 */
	async findByRefreshTokenHash(
		refreshTokenHash: string,
		client?: PoolClient
	): Promise<Session | null> {
		const dbClient = client || this.pool;

		try {
			const query = `
        SELECT * FROM sessions 
        WHERE refresh_token_hash = $1 
          AND is_active = true 
          AND refresh_expires_at > CURRENT_TIMESTAMP
          AND revoked_at IS NULL
      `;

			const result = await dbClient.query(query, [refreshTokenHash]);
			return result.rows[0] || null;
		} catch (error) {
			logger.error({ error }, "Failed to find session by refresh token hash");
			throw error;
		}
	}

	/**
	 * Find active sessions for a user
	 */
	async findActiveByUserId(
		userId: string,
		client?: PoolClient
	): Promise<Session[]> {
		const dbClient = client || this.pool;

		try {
			const query = `
        SELECT * FROM sessions 
        WHERE user_id = $1 
          AND is_active = true 
          AND expires_at > CURRENT_TIMESTAMP
          AND revoked_at IS NULL
        ORDER BY last_activity_at DESC
      `;

			const result = await dbClient.query(query, [userId]);
			return result.rows;
		} catch (error) {
			logger.error(
				{ error, userId },
				"Failed to find active sessions for user"
			);
			throw error;
		}
	}

	/**
	 * Update session activity
	 */
	async updateActivity(id: string, client?: PoolClient): Promise<boolean> {
		const dbClient = client || this.pool;

		try {
			const query = `
        UPDATE sessions 
        SET last_activity_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND is_active = true
      `;

			const result = await dbClient.query(query, [id]);
			return (result.rowCount && result.rowCount > 0) || false;
		} catch (error) {
			logger.error(
				{ error, sessionId: id },
				"Failed to update session activity"
			);
			throw error;
		}
	}

	/**
	 * Revoke session by ID
	 */
	async revokeById(
		id: string,
		reason: string = "manual_revoke",
		revokedBy?: string,
		client?: PoolClient
	): Promise<boolean> {
		const dbClient = client || this.pool;

		try {
			const query = `
        UPDATE sessions 
        SET 
          is_active = false,
          revoked_at = CURRENT_TIMESTAMP,
          revoked_by = $2,
          revoke_reason = $3
        WHERE id = $1 AND is_active = true
      `;

			const result = await dbClient.query(query, [
				id,
				revokedBy || null,
				reason,
			]);

			if (result.rowCount && result.rowCount > 0) {
				logger.info(
					{
						sessionId: id,
						reason,
						revokedBy,
					},
					"Session revoked successfully"
				);
				return true;
			}

			return false;
		} catch (error) {
			logger.error({ error, sessionId: id }, "Failed to revoke session");
			throw error;
		}
	}

	/**
	 * Revoke session by token hash
	 */
	async revokeByTokenHash(
		tokenHash: string,
		reason: string = "logout",
		revokedBy?: string,
		client?: PoolClient
	): Promise<boolean> {
		const dbClient = client || this.pool;

		try {
			const query = `
        UPDATE sessions 
        SET 
          is_active = false,
          revoked_at = CURRENT_TIMESTAMP,
          revoked_by = $2,
          revoke_reason = $3
        WHERE token_hash = $1 AND is_active = true
      `;

			const result = await dbClient.query(query, [
				tokenHash,
				revokedBy || null,
				reason,
			]);

			if (result.rowCount && result.rowCount > 0) {
				logger.info(
					{
						reason,
						revokedBy,
					},
					"Session revoked by token hash"
				);
				return true;
			}

			return false;
		} catch (error) {
			logger.error({ error }, "Failed to revoke session by token hash");
			throw error;
		}
	}

	/**
	 * Revoke all sessions for a user
	 */
	async revokeAllByUserId(
		userId: string,
		reason: string = "revoke_all_sessions",
		revokedBy?: string,
		excludeSessionId?: string,
		client?: PoolClient
	): Promise<number> {
		const dbClient = client || this.pool;

		try {
			let query = `
        UPDATE sessions 
        SET 
          is_active = false,
          revoked_at = CURRENT_TIMESTAMP,
          revoked_by = $2,
          revoke_reason = $3
        WHERE user_id = $1 AND is_active = true
      `;

			const queryParams = [userId, revokedBy || null, reason];

			if (excludeSessionId) {
				query += " AND id != $4";
				queryParams.push(excludeSessionId);
			}

			const result = await dbClient.query(query, queryParams);

			const revokedCount = result.rowCount || 0;

			logger.info(
				{
					userId,
					revokedCount,
					reason,
					revokedBy,
					excludeSessionId,
				},
				"User sessions revoked"
			);

			return revokedCount;
		} catch (error) {
			logger.error({ error, userId }, "Failed to revoke user sessions");
			throw error;
		}
	}

	/**
	 * Clean up expired sessions
	 */
	async cleanupExpiredSessions(client?: PoolClient): Promise<number> {
		const dbClient = client || this.pool;

		try {
			const query = `
        UPDATE sessions 
        SET 
          is_active = false,
          revoked_at = CURRENT_TIMESTAMP,
          revoke_reason = 'expired'
        WHERE is_active = true 
          AND (expires_at <= CURRENT_TIMESTAMP 
               OR (refresh_expires_at IS NOT NULL AND refresh_expires_at <= CURRENT_TIMESTAMP))
      `;

			const result = await dbClient.query(query);

			const cleanedCount = result.rowCount || 0;

			if (cleanedCount > 0) {
				logger.info({ cleanedCount }, "Expired sessions cleaned up");
			}

			return cleanedCount;
		} catch (error) {
			logger.error({ error }, "Failed to cleanup expired sessions");
			throw error;
		}
	}

	/**
	 * Find sessions with pagination and filtering
	 */
	async findMany(
		filters: {
			userId?: string;
			isActive?: boolean;
			ipAddress?: string;
			startDate?: Date;
			endDate?: Date;
		} = {},
		pagination: PaginationOptions = {}
	): Promise<PaginationResult<Session>> {
		try {
			const {
				page = 1,
				limit = 10,
				sortBy = "created_at",
				sortOrder = "DESC",
			} = pagination;

			const offset = (page - 1) * limit;

			// Build WHERE clause
			const whereConditions: string[] = [];
			const queryParams: any[] = [];
			let paramCounter = 1;

			if (filters.userId) {
				whereConditions.push(`user_id = $${paramCounter}`);
				queryParams.push(filters.userId);
				paramCounter++;
			}

			if (filters.isActive !== undefined) {
				whereConditions.push(`is_active = $${paramCounter}`);
				queryParams.push(filters.isActive);
				paramCounter++;
			}

			if (filters.ipAddress) {
				whereConditions.push(`ip_address = $${paramCounter}`);
				queryParams.push(filters.ipAddress);
				paramCounter++;
			}

			if (filters.startDate) {
				whereConditions.push(`created_at >= $${paramCounter}`);
				queryParams.push(filters.startDate);
				paramCounter++;
			}

			if (filters.endDate) {
				whereConditions.push(`created_at <= $${paramCounter}`);
				queryParams.push(filters.endDate);
				paramCounter++;
			}

			const whereClause =
				whereConditions.length > 0
					? `WHERE ${whereConditions.join(" AND ")}`
					: "";

			// Count total records
			const countQuery = `SELECT COUNT(*) FROM sessions ${whereClause}`;
			const countResult = await this.pool.query(countQuery, queryParams);
			const total = parseInt(countResult.rows[0].count);

			// Fetch paginated data
			const dataQuery = `
        SELECT * FROM sessions 
        ${whereClause}
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
			logger.error({ error, filters, pagination }, "Failed to find sessions");
			throw error;
		}
	}

	/**
	 * Get session statistics
	 */
	async getStatistics(
		filters: {
			userId?: string;
			startDate?: Date;
			endDate?: Date;
		} = {}
	): Promise<{
		totalSessions: number;
		activeSessions: number;
		expiredSessions: number;
		revokedSessions: number;
	}> {
		try {
			const whereConditions: string[] = [];
			const queryParams: any[] = [];
			let paramCounter = 1;

			if (filters.userId) {
				whereConditions.push(`user_id = $${paramCounter}`);
				queryParams.push(filters.userId);
				paramCounter++;
			}

			if (filters.startDate) {
				whereConditions.push(`created_at >= $${paramCounter}`);
				queryParams.push(filters.startDate);
				paramCounter++;
			}

			if (filters.endDate) {
				whereConditions.push(`created_at <= $${paramCounter}`);
				queryParams.push(filters.endDate);
				paramCounter++;
			}

			const whereClause =
				whereConditions.length > 0
					? `WHERE ${whereConditions.join(" AND ")}`
					: "";

			const query = `
        SELECT 
          COUNT(*) as total_sessions,
          SUM(CASE WHEN is_active = true AND expires_at > CURRENT_TIMESTAMP THEN 1 ELSE 0 END) as active_sessions,
          SUM(CASE WHEN expires_at <= CURRENT_TIMESTAMP THEN 1 ELSE 0 END) as expired_sessions,
          SUM(CASE WHEN revoked_at IS NOT NULL THEN 1 ELSE 0 END) as revoked_sessions
        FROM sessions ${whereClause}
      `;

			const result = await this.pool.query(query, queryParams);

			return {
				totalSessions: parseInt(result.rows[0].total_sessions),
				activeSessions: parseInt(result.rows[0].active_sessions),
				expiredSessions: parseInt(result.rows[0].expired_sessions),
				revokedSessions: parseInt(result.rows[0].revoked_sessions),
			};
		} catch (error) {
			logger.error({ error, filters }, "Failed to get session statistics");
			throw error;
		}
	}
}

export const sessionRepository = new SessionRepository();

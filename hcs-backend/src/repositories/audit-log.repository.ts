import { Pool, PoolClient } from "pg";
import {
	AuditLog,
	CreateAuditLogData,
	AuditAction,
	PaginationOptions,
	PaginationResult,
} from "../types/database";
import { pool } from "../config/database";
import logger from "../utils/logger";

export class AuditLogRepository {
	private pool: Pool;

	constructor() {
		this.pool = pool;
	}

	/**
	 * Create a new audit log entry
	 */
	async create(
		auditData: CreateAuditLogData,
		client?: PoolClient
	): Promise<AuditLog> {
		const dbClient = client || this.pool;

		try {
			const query = `
        INSERT INTO audit_logs (
          actor_id, action, entity_type, entity_id, entity_name,
          old_values, new_values, metadata, ip_address, user_agent,
          session_id, risk_score, success, error_message, execution_time_ms
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `;

			const values = [
				auditData.actor_id || null,
				auditData.action,
				auditData.entity_type,
				auditData.entity_id || null,
				auditData.entity_name || null,
				auditData.old_values ? JSON.stringify(auditData.old_values) : null,
				auditData.new_values ? JSON.stringify(auditData.new_values) : null,
				auditData.metadata ? JSON.stringify(auditData.metadata) : null,
				auditData.ip_address || null,
				auditData.user_agent || null,
				auditData.session_id || null,
				auditData.risk_score || 0,
				auditData.success !== undefined ? auditData.success : true,
				auditData.error_message || null,
				auditData.execution_time_ms || null,
			];

			const result = await dbClient.query(query, values);

			// Only log high-risk or failed operations to avoid log spam
			if (
				(auditData.risk_score && auditData.risk_score > 50) ||
				auditData.success === false
			) {
				logger.info(
					{
						auditId: result.rows[0].id,
						action: auditData.action,
						entityType: auditData.entity_type,
						riskScore: auditData.risk_score,
					},
					"High-risk audit log created"
				);
			}

			return result.rows[0];
		} catch (error) {
			logger.error({ error, auditData }, "Failed to create audit log");
			throw error;
		}
	}

	/**
	 * Find audit log by ID
	 */
	async findById(id: string, client?: PoolClient): Promise<AuditLog | null> {
		const dbClient = client || this.pool;

		try {
			const query = `SELECT * FROM audit_logs WHERE id = $1`;
			const result = await dbClient.query(query, [id]);
			return result.rows[0] || null;
		} catch (error) {
			logger.error({ error, auditId: id }, "Failed to find audit log by ID");
			throw error;
		}
	}

	/**
	 * Find audit logs with pagination and filtering
	 */
	async findMany(
		filters: {
			actorId?: string;
			action?: AuditAction;
			entityType?: string;
			entityId?: string;
			success?: boolean;
			minRiskScore?: number;
			maxRiskScore?: number;
			startDate?: Date;
			endDate?: Date;
			ipAddress?: string;
			sessionId?: string;
		} = {},
		pagination: PaginationOptions = {}
	): Promise<PaginationResult<AuditLog>> {
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

			if (filters.actorId) {
				whereConditions.push(`actor_id = $${paramCounter}`);
				queryParams.push(filters.actorId);
				paramCounter++;
			}

			if (filters.action) {
				whereConditions.push(`action = $${paramCounter}`);
				queryParams.push(filters.action);
				paramCounter++;
			}

			if (filters.entityType) {
				whereConditions.push(`entity_type = $${paramCounter}`);
				queryParams.push(filters.entityType);
				paramCounter++;
			}

			if (filters.entityId) {
				whereConditions.push(`entity_id = $${paramCounter}`);
				queryParams.push(filters.entityId);
				paramCounter++;
			}

			if (filters.success !== undefined) {
				whereConditions.push(`success = $${paramCounter}`);
				queryParams.push(filters.success);
				paramCounter++;
			}

			if (filters.minRiskScore !== undefined) {
				whereConditions.push(`risk_score >= $${paramCounter}`);
				queryParams.push(filters.minRiskScore);
				paramCounter++;
			}

			if (filters.maxRiskScore !== undefined) {
				whereConditions.push(`risk_score <= $${paramCounter}`);
				queryParams.push(filters.maxRiskScore);
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

			if (filters.ipAddress) {
				whereConditions.push(`ip_address = $${paramCounter}`);
				queryParams.push(filters.ipAddress);
				paramCounter++;
			}

			if (filters.sessionId) {
				whereConditions.push(`session_id = $${paramCounter}`);
				queryParams.push(filters.sessionId);
				paramCounter++;
			}

			const whereClause =
				whereConditions.length > 0
					? `WHERE ${whereConditions.join(" AND ")}`
					: "";

			// Count total records
			const countQuery = `SELECT COUNT(*) FROM audit_logs ${whereClause}`;
			const countResult = await this.pool.query(countQuery, queryParams);
			const total = parseInt(countResult.rows[0].count);

			// Fetch paginated data
			const dataQuery = `
        SELECT * FROM audit_logs 
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
			logger.error({ error, filters, pagination }, "Failed to find audit logs");
			throw error;
		}
	}

	/**
	 * Find audit logs for a specific entity
	 */
	async findByEntity(
		entityType: string,
		entityId: string,
		pagination: PaginationOptions = {}
	): Promise<PaginationResult<AuditLog>> {
		return this.findMany({ entityType, entityId }, pagination);
	}

	/**
	 * Find audit logs for a specific user (actor)
	 */
	async findByActor(
		actorId: string,
		pagination: PaginationOptions = {}
	): Promise<PaginationResult<AuditLog>> {
		return this.findMany({ actorId }, pagination);
	}

	/**
	 * Find failed operations (for security monitoring)
	 */
	async findFailedOperations(
		filters: {
			startDate?: Date;
			endDate?: Date;
			minRiskScore?: number;
		} = {},
		pagination: PaginationOptions = {}
	): Promise<PaginationResult<AuditLog>> {
		return this.findMany(
			{
				success: false,
				startDate: filters.startDate,
				endDate: filters.endDate,
				minRiskScore: filters.minRiskScore,
			},
			pagination
		);
	}

	/**
	 * Find high-risk operations (for security monitoring)
	 */
	async findHighRiskOperations(
		riskThreshold: number = 70,
		filters: {
			startDate?: Date;
			endDate?: Date;
		} = {},
		pagination: PaginationOptions = {}
	): Promise<PaginationResult<AuditLog>> {
		return this.findMany(
			{
				minRiskScore: riskThreshold,
				startDate: filters.startDate,
				endDate: filters.endDate,
			},
			pagination
		);
	}

	/**
	 * Get audit statistics
	 */
	async getStatistics(
		filters: {
			startDate?: Date;
			endDate?: Date;
			actorId?: string;
		} = {}
	): Promise<{
		totalOperations: number;
		successfulOperations: number;
		failedOperations: number;
		highRiskOperations: number;
		topActions: Array<{ action: string; count: number }>;
		topEntityTypes: Array<{ entity_type: string; count: number }>;
	}> {
		try {
			const whereConditions: string[] = [];
			const queryParams: any[] = [];
			let paramCounter = 1;

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

			if (filters.actorId) {
				whereConditions.push(`actor_id = $${paramCounter}`);
				queryParams.push(filters.actorId);
				paramCounter++;
			}

			const whereClause =
				whereConditions.length > 0
					? `WHERE ${whereConditions.join(" AND ")}`
					: "";

			// Get basic statistics
			const statsQuery = `
        SELECT 
          COUNT(*) as total_operations,
          SUM(CASE WHEN success = true THEN 1 ELSE 0 END) as successful_operations,
          SUM(CASE WHEN success = false THEN 1 ELSE 0 END) as failed_operations,
          SUM(CASE WHEN risk_score >= 70 THEN 1 ELSE 0 END) as high_risk_operations
        FROM audit_logs ${whereClause}
      `;

			// Get top actions
			const actionsQuery = `
        SELECT action, COUNT(*) as count
        FROM audit_logs ${whereClause}
        GROUP BY action
        ORDER BY count DESC
        LIMIT 10
      `;

			// Get top entity types
			const entityTypesQuery = `
        SELECT entity_type, COUNT(*) as count
        FROM audit_logs ${whereClause}
        GROUP BY entity_type
        ORDER BY count DESC
        LIMIT 10
      `;

			const [statsResult, actionsResult, entityTypesResult] = await Promise.all(
				[
					this.pool.query(statsQuery, queryParams),
					this.pool.query(actionsQuery, queryParams),
					this.pool.query(entityTypesQuery, queryParams),
				]
			);

			return {
				totalOperations: parseInt(statsResult.rows[0].total_operations),
				successfulOperations: parseInt(
					statsResult.rows[0].successful_operations
				),
				failedOperations: parseInt(statsResult.rows[0].failed_operations),
				highRiskOperations: parseInt(statsResult.rows[0].high_risk_operations),
				topActions: actionsResult.rows,
				topEntityTypes: entityTypesResult.rows,
			};
		} catch (error) {
			logger.error({ error, filters }, "Failed to get audit statistics");
			throw error;
		}
	}

	/**
	 * Clean up old audit logs (for maintenance)
	 */
	async cleanupOldLogs(
		olderThanDays: number = 365,
		keepHighRiskLogs: boolean = true,
		client?: PoolClient
	): Promise<number> {
		const dbClient = client || this.pool;

		try {
			const cutoffDate = new Date();
			cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

			let query = `
        DELETE FROM audit_logs 
        WHERE created_at < $1
      `;

			const queryParams = [cutoffDate];

			if (keepHighRiskLogs) {
				query += " AND risk_score < 70";
			}

			const result = await dbClient.query(query, queryParams);

			const deletedCount = result.rowCount || 0;

			logger.info(
				{
					deletedCount,
					cutoffDate,
					keepHighRiskLogs,
				},
				"Audit logs cleanup completed"
			);

			return deletedCount;
		} catch (error) {
			logger.error({ error, olderThanDays }, "Failed to cleanup audit logs");
			throw error;
		}
	}
}

export const auditLogRepository = new AuditLogRepository();

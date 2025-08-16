import { Pool, PoolClient } from "pg";
import {
	Profile,
	CreateProfileData,
	UpdateProfileData,
	PaginationOptions,
	PaginationResult,
} from "../types/database";
import { pool } from "../config/database";
import logger from "../utils/logger";

export class ProfileRepository {
	private pool: Pool;

	constructor() {
		this.pool = pool;
	}

	/**
	 * Create a new profile
	 */
	async create(
		profileData: CreateProfileData,
		client?: PoolClient
	): Promise<Profile> {
		const dbClient = client || this.pool;

		try {
			const query = `
        INSERT INTO profiles (
          user_id, first_name, last_name, middle_name, date_of_birth, 
          gender, phone_number, address_line1, address_line2, city, 
          state, postal_code, country, emergency_contact_name, 
          emergency_contact_phone, emergency_contact_relation, 
          avatar_url, bio, nationality, blood_group
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING *
      `;

			const values = [
				profileData.user_id,
				profileData.first_name,
				profileData.last_name,
				profileData.middle_name || null,
				profileData.date_of_birth || null,
				profileData.gender || null,
				profileData.phone_number || null,
				profileData.address_line1 || null,
				profileData.address_line2 || null,
				profileData.city || null,
				profileData.state || null,
				profileData.postal_code || null,
				profileData.country || "India",
				profileData.emergency_contact_name || null,
				profileData.emergency_contact_phone || null,
				profileData.emergency_contact_relation || null,
				profileData.avatar_url || null,
				profileData.bio || null,
				profileData.nationality || null,
				profileData.blood_group || null,
			];

			const result = await dbClient.query(query, values);

			logger.info(
				{
					profileId: result.rows[0].id,
					userId: profileData.user_id,
					fullName: `${profileData.first_name} ${profileData.last_name}`,
				},
				"Profile created successfully"
			);

			return result.rows[0];
		} catch (error) {
			logger.error(
				{ error, userId: profileData.user_id },
				"Failed to create profile"
			);
			throw error;
		}
	}

	/**
	 * Find profile by ID
	 */
	async findById(id: string, client?: PoolClient): Promise<Profile | null> {
		const dbClient = client || this.pool;

		try {
			const query = `
        SELECT * FROM profiles 
        WHERE id = $1 AND deleted_at IS NULL
      `;

			const result = await dbClient.query(query, [id]);
			return result.rows[0] || null;
		} catch (error) {
			logger.error({ error, profileId: id }, "Failed to find profile by ID");
			throw error;
		}
	}

	/**
	 * Find profile by user ID
	 */
	async findByUserId(
		userId: string,
		client?: PoolClient
	): Promise<Profile | null> {
		const dbClient = client || this.pool;

		try {
			const query = `
        SELECT * FROM profiles 
        WHERE user_id = $1 AND deleted_at IS NULL
      `;

			const result = await dbClient.query(query, [userId]);
			return result.rows[0] || null;
		} catch (error) {
			logger.error({ error, userId }, "Failed to find profile by user ID");
			throw error;
		}
	}

	/**
	 * Update profile by ID
	 */
	async updateById(
		id: string,
		updateData: UpdateProfileData,
		client?: PoolClient
	): Promise<Profile | null> {
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
        UPDATE profiles 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING *
      `;

			const result = await dbClient.query(query, [id, ...values]);

			if (result.rows[0]) {
				logger.info(
					{
						profileId: id,
						updatedFields: fields,
					},
					"Profile updated successfully"
				);
			}

			return result.rows[0] || null;
		} catch (error) {
			logger.error({ error, profileId: id }, "Failed to update profile");
			throw error;
		}
	}

	/**
	 * Update profile by user ID
	 */
	async updateByUserId(
		userId: string,
		updateData: UpdateProfileData,
		client?: PoolClient
	): Promise<Profile | null> {
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
        UPDATE profiles 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1 AND deleted_at IS NULL
        RETURNING *
      `;

			const result = await dbClient.query(query, [userId, ...values]);

			if (result.rows[0]) {
				logger.info(
					{
						userId,
						updatedFields: fields,
					},
					"Profile updated successfully"
				);
			}

			return result.rows[0] || null;
		} catch (error) {
			logger.error({ error, userId }, "Failed to update profile by user ID");
			throw error;
		}
	}

	/**
	 * Soft delete profile by ID
	 */
	async deleteById(id: string, client?: PoolClient): Promise<boolean> {
		const dbClient = client || this.pool;

		try {
			const query = `
        UPDATE profiles 
        SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
      `;

			const result = await dbClient.query(query, [id]);

			if (result.rowCount && result.rowCount > 0) {
				logger.info({ profileId: id }, "Profile soft deleted successfully");
				return true;
			}

			return false;
		} catch (error) {
			logger.error({ error, profileId: id }, "Failed to delete profile");
			throw error;
		}
	}

	/**
	 * Find profiles with pagination and filtering
	 */
	async findMany(
		filters: {
			search?: string;
			city?: string;
			state?: string;
			country?: string;
		} = {},
		pagination: PaginationOptions = {}
	): Promise<PaginationResult<Profile>> {
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

			if (filters.search) {
				whereConditions.push(
					`(first_name ILIKE $${paramCounter} OR last_name ILIKE $${paramCounter} OR phone_number ILIKE $${paramCounter})`
				);
				queryParams.push(`%${filters.search}%`);
				paramCounter++;
			}

			if (filters.city) {
				whereConditions.push(`city = $${paramCounter}`);
				queryParams.push(filters.city);
				paramCounter++;
			}

			if (filters.state) {
				whereConditions.push(`state = $${paramCounter}`);
				queryParams.push(filters.state);
				paramCounter++;
			}

			if (filters.country) {
				whereConditions.push(`country = $${paramCounter}`);
				queryParams.push(filters.country);
				paramCounter++;
			}

			const whereClause = whereConditions.join(" AND ");

			// Count total records
			const countQuery = `SELECT COUNT(*) FROM profiles WHERE ${whereClause}`;
			const countResult = await this.pool.query(countQuery, queryParams);
			const total = parseInt(countResult.rows[0].count);

			// Fetch paginated data
			const dataQuery = `
        SELECT * FROM profiles 
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
			logger.error({ error, filters, pagination }, "Failed to find profiles");
			throw error;
		}
	}

	/**
	 * Get profile with user data (JOIN)
	 */
	async findWithUserById(
		id: string,
		client?: PoolClient
	): Promise<(Profile & { user: any }) | null> {
		const dbClient = client || this.pool;

		try {
			const query = `
        SELECT 
          p.*,
          json_build_object(
            'id', u.id,
            'email', u.email,
            'role', u.role,
            'status', u.status,
            'email_verified', u.email_verified,
            'last_login_at', u.last_login_at,
            'created_at', u.created_at
          ) as user
        FROM profiles p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.id = $1 AND p.deleted_at IS NULL AND u.deleted_at IS NULL
      `;

			const result = await dbClient.query(query, [id]);
			return result.rows[0] || null;
		} catch (error) {
			logger.error(
				{ error, profileId: id },
				"Failed to find profile with user data"
			);
			throw error;
		}
	}

	/**
	 * Get profile with user data by user ID (JOIN)
	 */
	async findWithUserByUserId(
		userId: string,
		client?: PoolClient
	): Promise<(Profile & { user: any }) | null> {
		const dbClient = client || this.pool;

		try {
			const query = `
        SELECT 
          p.*,
          json_build_object(
            'id', u.id,
            'email', u.email,
            'role', u.role,
            'status', u.status,
            'email_verified', u.email_verified,
            'last_login_at', u.last_login_at,
            'created_at', u.created_at
          ) as user
        FROM profiles p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.user_id = $1 AND p.deleted_at IS NULL AND u.deleted_at IS NULL
      `;

			const result = await dbClient.query(query, [userId]);
			return result.rows[0] || null;
		} catch (error) {
			logger.error(
				{ error, userId },
				"Failed to find profile with user data by user ID"
			);
			throw error;
		}
	}
}

export const profileRepository = new ProfileRepository();

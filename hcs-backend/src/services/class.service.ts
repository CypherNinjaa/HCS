import {
	ClassRepository,
	Class,
	CreateClassInput,
	UpdateClassInput,
	ClassListOptions,
} from "../repositories/class.repository";
import { z } from "zod";
import logger from "../utils/logger";

// Validation schemas
export const createClassSchema = z.object({
	name: z
		.string()
		.min(1, "Class name is required")
		.max(50, "Class name must be less than 50 characters"),
	grade: z
		.number()
		.int()
		.min(1, "Grade must be at least 1")
		.max(12, "Grade must be at most 12"),
	academic_year_id: z.string().uuid("Invalid academic year ID"),
	section: z
		.string()
		.min(1, "Section is required")
		.max(10, "Section must be less than 10 characters"),
	capacity: z
		.number()
		.int()
		.min(1, "Capacity must be at least 1")
		.max(100, "Capacity must be less than 100"),
	class_teacher_id: z.string().uuid("Invalid teacher ID").optional(),
	room_number: z
		.string()
		.max(20, "Room number must be less than 20 characters")
		.optional(),
});

export const updateClassSchema = z.object({
	name: z
		.string()
		.min(1, "Class name is required")
		.max(50, "Class name must be less than 50 characters")
		.optional(),
	grade: z
		.number()
		.int()
		.min(1, "Grade must be at least 1")
		.max(12, "Grade must be at most 12")
		.optional(),
	section: z
		.string()
		.min(1, "Section is required")
		.max(10, "Section must be less than 10 characters")
		.optional(),
	capacity: z
		.number()
		.int()
		.min(1, "Capacity must be at least 1")
		.max(100, "Capacity must be less than 100")
		.optional(),
	class_teacher_id: z.string().uuid("Invalid teacher ID").nullable().optional(),
	room_number: z
		.string()
		.max(20, "Room number must be less than 20 characters")
		.nullable()
		.optional(),
	is_active: z.boolean().optional(),
});

export const classListSchema = z.object({
	page: z.number().int().min(1).optional().default(1),
	limit: z.number().int().min(1).max(100).optional().default(10),
	sortBy: z
		.enum([
			"name",
			"grade",
			"section",
			"capacity",
			"current_strength",
			"created_at",
		])
		.optional()
		.default("name"),
	sortOrder: z.enum(["ASC", "DESC"]).optional().default("ASC"),
	academic_year_id: z.string().uuid().optional(),
	name: z.string().optional(),
	grade: z.number().int().min(1).max(12).optional(),
	section: z.string().optional(),
	is_active: z.boolean().optional(),
	search: z.string().optional(),
});

export class ClassService {
	private classRepository: ClassRepository;

	constructor() {
		this.classRepository = new ClassRepository();
	}

	async createClass(
		classData: CreateClassInput,
		userId: string
	): Promise<Class> {
		try {
			// Validate input data
			const validatedData = createClassSchema.parse(classData);

			logger.info({ classData: validatedData, userId }, "Creating new class");

			// Check if class with same grade and section already exists for the academic year
			const existingClasses = await this.classRepository.findAll({
				filters: {
					academic_year_id: validatedData.academic_year_id,
					grade: validatedData.grade,
					section: validatedData.section,
				},
			});

			if (existingClasses.classes.length > 0) {
				throw new Error(
					`Grade ${validatedData.grade} - Section ${validatedData.section} already exists for this academic year`
				);
			}

			const newClass = await this.classRepository.create(validatedData, userId);

			logger.info(
				{ classId: newClass.id, userId },
				"Class created successfully"
			);

			return newClass;
		} catch (error) {
			logger.error({ error, classData, userId }, "Error creating class");
			throw error;
		}
	}

	async getClassById(id: string): Promise<Class | null> {
		try {
			if (!z.string().uuid().safeParse(id).success) {
				throw new Error("Invalid class ID format");
			}

			return await this.classRepository.findById(id);
		} catch (error) {
			logger.error({ error, id }, "Error getting class by ID");
			throw error;
		}
	}

	async getAllClasses(options: any = {}): Promise<{
		classes: Class[];
		pagination: {
			total: number;
			page: number;
			limit: number;
			totalPages: number;
		};
	}> {
		try {
			// Validate and parse options
			const validatedOptions = classListSchema.parse(options);

			const filters = {
				...(validatedOptions.academic_year_id && {
					academic_year_id: validatedOptions.academic_year_id,
				}),
				...(validatedOptions.name && { name: validatedOptions.name }),
				...(validatedOptions.grade && { grade: validatedOptions.grade }),
				...(validatedOptions.section && { section: validatedOptions.section }),
				...(validatedOptions.is_active !== undefined && {
					is_active: validatedOptions.is_active,
				}),
				...(validatedOptions.search && { search: validatedOptions.search }),
			};

			const listOptions: ClassListOptions = {
				page: validatedOptions.page,
				limit: validatedOptions.limit,
				sortBy: validatedOptions.sortBy,
				sortOrder: validatedOptions.sortOrder,
				filters,
			};

			return await this.classRepository.findAll(listOptions);
		} catch (error) {
			logger.error({ error, options }, "Error getting all classes");
			throw error;
		}
	}

	async updateClass(
		id: string,
		updates: UpdateClassInput,
		userId: string
	): Promise<Class | null> {
		try {
			if (!z.string().uuid().safeParse(id).success) {
				throw new Error("Invalid class ID format");
			}

			// Validate update data
			const validatedUpdates = updateClassSchema.parse(updates);

			logger.info(
				{ classId: id, updates: validatedUpdates, userId },
				"Updating class"
			);

			// Check if class exists
			const existingClass = await this.classRepository.findById(id);
			if (!existingClass) {
				throw new Error("Class not found");
			}

			// If updating name/section, check for duplicates
			if (validatedUpdates.name || validatedUpdates.section) {
				const nameToCheck = validatedUpdates.name || existingClass.name;
				const sectionToCheck =
					validatedUpdates.section || existingClass.section;

				const existingClasses = await this.classRepository.findAll({
					filters: {
						academic_year_id: existingClass.academic_year_id,
						name: nameToCheck,
						section: sectionToCheck,
					},
				});

				// Check if another class (not the current one) has the same name/section
				const duplicateClass = existingClasses.classes.find(
					(cls) => cls.id !== id
				);
				if (duplicateClass) {
					throw new Error(
						`Class ${nameToCheck} - Section ${sectionToCheck} already exists for this academic year`
					);
				}
			}

			const updatedClass = await this.classRepository.update(
				id,
				validatedUpdates,
				userId
			);

			logger.info({ classId: id, userId }, "Class updated successfully");

			return updatedClass;
		} catch (error) {
			logger.error({ error, id, updates, userId }, "Error updating class");
			throw error;
		}
	}

	async deleteClass(id: string, userId: string): Promise<boolean> {
		try {
			if (!z.string().uuid().safeParse(id).success) {
				throw new Error("Invalid class ID format");
			}

			logger.info({ classId: id, userId }, "Deleting class");

			// Check if class exists
			const existingClass = await this.classRepository.findById(id);
			if (!existingClass) {
				throw new Error("Class not found");
			}

			// Check if class has any students enrolled
			// This would be a more complex check involving student repository
			// For now, we'll just proceed with soft delete

			const result = await this.classRepository.delete(id, userId);

			logger.info({ classId: id, userId }, "Class deleted successfully");

			return result;
		} catch (error) {
			logger.error({ error, id, userId }, "Error deleting class");
			throw error;
		}
	}

	async getClassStats(): Promise<{
		total: number;
		active: number;
		inactive: number;
		byAcademicYear: Array<{ academic_year: string; count: number }>;
	}> {
		try {
			return await this.classRepository.getStats();
		} catch (error) {
			logger.error({ error }, "Error getting class statistics");
			throw error;
		}
	}

	async getClassesByAcademicYear(academicYearId: string): Promise<Class[]> {
		try {
			if (!z.string().uuid().safeParse(academicYearId).success) {
				throw new Error("Invalid academic year ID format");
			}

			const result = await this.classRepository.findAll({
				filters: { academic_year_id: academicYearId, is_active: true },
				limit: 100, // Get all active classes for the academic year
			});

			return result.classes;
		} catch (error) {
			logger.error(
				{ error, academicYearId },
				"Error getting classes by academic year"
			);
			throw error;
		}
	}

	async checkClassCapacity(classId: string): Promise<{
		capacity: number;
		currentStrength: number;
		availableSlots: number;
		isAtCapacity: boolean;
	}> {
		try {
			if (!z.string().uuid().safeParse(classId).success) {
				throw new Error("Invalid class ID format");
			}

			const classData = await this.classRepository.findById(classId);
			if (!classData) {
				throw new Error("Class not found");
			}

			const availableSlots = classData.capacity - classData.current_strength;
			const isAtCapacity = availableSlots <= 0;

			return {
				capacity: classData.capacity,
				currentStrength: classData.current_strength,
				availableSlots,
				isAtCapacity,
			};
		} catch (error) {
			logger.error({ error, classId }, "Error checking class capacity");
			throw error;
		}
	}
}

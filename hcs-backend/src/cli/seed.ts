import { authService } from "../services/auth.service";
import logger from "../utils/logger";

/**
 * Seed initial admin user
 */
async function seedAdminUser(): Promise<void> {
	const adminData = {
		email: "admin@happychildschool.com",
		password: "Admin@123456",
		role: "admin" as const,
		firstName: "System",
		lastName: "Administrator",
		phoneNumber: "+1234567890",
	};

	try {
		// Check if admin already exists
		logger.info("Checking if admin user already exists...");

		try {
			const result = await authService.login(
				{
					email: adminData.email,
					password: adminData.password,
				},
				{
					ipAddress: "127.0.0.1",
					userAgent: "seed-script",
					deviceInfo: { source: "seed-script" },
				}
			);

			logger.info({ userId: result.user.id }, "Admin user already exists");
			return;
		} catch (error) {
			// Admin doesn't exist or password is different, create new one
			logger.info("Admin user not found, creating new admin user...");
		}

		// Create admin user
		const result = await authService.register(adminData, {
			ipAddress: "127.0.0.1",
			userAgent: "seed-script",
			deviceInfo: { source: "seed-script" },
		});

		logger.info(
			{
				userId: result.user.id,
				email: result.user.email,
			},
			"Admin user created successfully"
		);

		console.log("\n🎉 Admin user created successfully!");
		console.log("📧 Email:", adminData.email);
		console.log("🔑 Password:", adminData.password);
		console.log("⚠️  Please change the password after first login!\n");
	} catch (error) {
		logger.error({ error }, "Failed to create admin user");
		throw error;
	}
}

/**
 * Seed test users for development
 */
async function seedTestUsers(): Promise<void> {
	const testUsers = [
		{
			email: "teacher@test.com",
			password: "Teacher@123",
			role: "teacher" as const,
			firstName: "John",
			lastName: "Teacher",
			phoneNumber: "+1234567891",
		},
		{
			email: "student@test.com",
			password: "Student@123",
			role: "student" as const,
			firstName: "Jane",
			lastName: "Student",
			phoneNumber: "+1234567892",
		},
		{
			email: "parent@test.com",
			password: "Parent@123",
			role: "parent" as const,
			firstName: "Bob",
			lastName: "Parent",
			phoneNumber: "+1234567893",
		},
		{
			email: "librarian@test.com",
			password: "Librarian@123",
			role: "librarian" as const,
			firstName: "Alice",
			lastName: "Librarian",
			phoneNumber: "+1234567894",
		},
	];

	logger.info("Creating test users for development...");

	for (const userData of testUsers) {
		try {
			// Check if user already exists
			try {
				await authService.login(
					{
						email: userData.email,
						password: userData.password,
					},
					{
						ipAddress: "127.0.0.1",
						userAgent: "seed-script",
						deviceInfo: { source: "seed-script" },
					}
				);

				logger.info({ email: userData.email }, "Test user already exists");
				continue;
			} catch (error) {
				// User doesn't exist, create new one
			}

			const result = await authService.register(userData, {
				ipAddress: "127.0.0.1",
				userAgent: "seed-script",
				deviceInfo: { source: "seed-script" },
			});

			logger.info(
				{
					userId: result.user.id,
					email: result.user.email,
					role: result.user.role,
				},
				"Test user created"
			);
		} catch (error) {
			logger.error(
				{ error, email: userData.email },
				"Failed to create test user"
			);
		}
	}

	console.log("\n🧪 Test users created for development:");
	testUsers.forEach((user) => {
		console.log(`📧 ${user.email} | 🔑 ${user.password} | 👤 ${user.role}`);
	});
	console.log("");
}

/**
 * Main seed function
 */
async function main(): Promise<void> {
	try {
		console.log("🌱 Starting database seeding...\n");

		// Seed admin user
		await seedAdminUser();

		// Seed test users only in development
		if (process.env.NODE_ENV === "development") {
			await seedTestUsers();
		}

		console.log("✅ Database seeding completed successfully!\n");
		process.exit(0);
	} catch (error) {
		logger.error({ error }, "Database seeding failed");
		console.error("❌ Database seeding failed:", (error as Error).message);
		process.exit(1);
	}
}

// Run seeding if this file is executed directly
if (require.main === module) {
	main();
}

export { seedAdminUser, seedTestUsers };

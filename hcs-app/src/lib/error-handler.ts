/**
 * Error handling utilities for the application
 */

/**
 * Handle API errors and convert them to user-friendly messages
 * @param error - The error to handle (can be any type)
 * @returns A user-friendly error message string
 */
export function handleApiError(error: unknown): string {
	// Handle Supabase errors
	if (error && typeof error === "object" && "message" in error) {
		const errorMessage = (error as { message: string }).message;

		// Common Supabase error mappings
		if (errorMessage.includes("Invalid login credentials")) {
			return "Invalid email or password. Please try again.";
		}

		if (errorMessage.includes("Email not confirmed")) {
			return "Please check your email and click the confirmation link before signing in.";
		}

		if (errorMessage.includes("Password should be at least")) {
			return "Password should be at least 6 characters long.";
		}

		if (errorMessage.includes("User already registered")) {
			return "An account with this email already exists. Please sign in instead.";
		}

		if (errorMessage.includes("Invalid email")) {
			return "Please enter a valid email address.";
		}

		if (errorMessage.includes("network")) {
			return "Network error. Please check your connection and try again.";
		}

		// Return the original message if no specific mapping found
		return errorMessage;
	}

	// Handle Error objects
	if (error instanceof Error) {
		return error.message;
	}

	// Handle string errors
	if (typeof error === "string") {
		return error;
	}

	// Default error message
	return "An unexpected error occurred. Please try again.";
}

/**
 * Log errors for debugging purposes
 * @param error - The error to log
 * @param context - Additional context about where the error occurred
 */
export function logError(error: unknown, context?: string) {
	const timestamp = new Date().toISOString();
	const contextInfo = context ? `[${context}]` : "";

	console.error(`${timestamp} ${contextInfo} Error:`, error);

	// In production, you might want to send errors to a logging service
	// e.g., Sentry, LogRocket, etc.
}

/**
 * Check if an error is a network-related error
 * @param error - The error to check
 * @returns True if it's a network error
 */
export function isNetworkError(error: unknown): boolean {
	if (error && typeof error === "object" && "message" in error) {
		const message = (error as { message: string }).message.toLowerCase();
		return (
			message.includes("network") ||
			message.includes("fetch") ||
			message.includes("connection")
		);
	}
	return false;
}

/**
 * Check if an error is an authentication-related error
 * @param error - The error to check
 * @returns True if it's an auth error
 */
export function isAuthError(error: unknown): boolean {
	if (error && typeof error === "object" && "message" in error) {
		const message = (error as { message: string }).message.toLowerCase();
		return (
			message.includes("unauthorized") ||
			message.includes("invalid login") ||
			message.includes("token") ||
			message.includes("authentication")
		);
	}
	return false;
}

/**
 * Format validation errors for display
 * @param errors - Validation errors (could be from Zod or other validation libraries)
 * @returns Formatted error messages
 */
export function formatValidationErrors(
	errors: Record<string, string[]>
): string[] {
	const formatted: string[] = [];

	for (const [field, messages] of Object.entries(errors)) {
		messages.forEach((message) => {
			formatted.push(`${field}: ${message}`);
		});
	}

	return formatted;
}

/**
 * Create a standardized error response
 * @param message - The error message
 * @param code - Optional error code
 * @param details - Optional additional details
 */
export function createErrorResponse(
	message: string,
	code?: string,
	details?: unknown
) {
	return {
		error: true,
		message,
		code,
		details,
		timestamp: new Date().toISOString(),
	};
}

/**
 * Check if a value is an error response
 * @param value - The value to check
 * @returns True if it's an error response
 */
export function isErrorResponse(
	value: unknown
): value is { error: true; message: string } {
	return (
		value !== null &&
		typeof value === "object" &&
		"error" in value &&
		"message" in value &&
		(value as { error: boolean }).error === true
	);
}

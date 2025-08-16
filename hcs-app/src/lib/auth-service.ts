import {
	ApiResponse,
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
	User,
} from "@/types/auth";
import { apiClient, tokenStorage } from "@/lib/api-client";

export class AuthService {
	/**
	 * Login user with email and password
	 */
	async login(credentials: LoginRequest): Promise<LoginResponse["data"]> {
		const response = await apiClient.post<LoginResponse>(
			"/auth/login",
			credentials
		);

		if (response.success && response.data) {
			// Store tokens and user data
			tokenStorage.setTokens(
				response.data.accessToken,
				response.data.refreshToken
			);
			tokenStorage.setExpiryTime(response.data.expiresAt);

			if (typeof window !== "undefined") {
				localStorage.setItem("user", JSON.stringify(response.data.user));
			}

			return response.data;
		}

		throw new Error("Login failed");
	}

	/**
	 * Register new user
	 */
	async register(userData: RegisterRequest): Promise<RegisterResponse["data"]> {
		const response = await apiClient.post<RegisterResponse>(
			"/auth/register",
			userData
		);

		if (response.success && response.data) {
			// Store tokens and user data
			tokenStorage.setTokens(
				response.data.accessToken,
				response.data.refreshToken
			);
			tokenStorage.setExpiryTime(response.data.expiresAt);

			if (typeof window !== "undefined") {
				localStorage.setItem("user", JSON.stringify(response.data.user));
			}

			return response.data;
		}

		throw new Error("Registration failed");
	}

	/**
	 * Logout user
	 */
	async logout(): Promise<void> {
		try {
			// Call backend logout endpoint to invalidate session
			await apiClient.authenticatedRequest("/auth/logout", { method: "POST" });
		} catch (error) {
			// Even if backend call fails, we should clear local tokens
			console.warn("Logout request failed:", error);
		} finally {
			// Clear local storage
			tokenStorage.clearTokens();

			if (typeof window !== "undefined") {
				localStorage.removeItem("user");
			}
		}
	}

	/**
	 * Get current user information
	 */
	async getCurrentUser(): Promise<{ user: User }> {
		const response = await apiClient.authenticatedRequest<
			ApiResponse<{ user: User }>
		>("/auth/me");

		if (response.success && response.data) {
			// Update stored user data
			if (typeof window !== "undefined") {
				localStorage.setItem("user", JSON.stringify(response.data.user));
			}

			return response.data;
		}

		throw new Error("Failed to get user information");
	}

	/**
	 * Refresh authentication token
	 */
	async refreshToken(): Promise<boolean> {
		return await apiClient.refreshToken();
	}

	/**
	 * Get stored user data
	 */
	getStoredUser(): User | null {
		if (typeof window === "undefined") return null;

		try {
			const userData = localStorage.getItem("user");
			return userData ? JSON.parse(userData) : null;
		} catch {
			return null;
		}
	}

	/**
	 * Check if user is authenticated
	 */
	isAuthenticated(): boolean {
		const accessToken = tokenStorage.getAccessToken();
		const user = this.getStoredUser();

		return !!(accessToken && user && !tokenStorage.isTokenExpired());
	}

	/**
	 * Check if user has specific role
	 */
	hasRole(role: User["role"]): boolean {
		const user = this.getStoredUser();
		return user?.role === role;
	}

	/**
	 * Check if user has any of the specified roles
	 */
	hasAnyRole(roles: User["role"][]): boolean {
		const user = this.getStoredUser();
		return user ? roles.includes(user.role) : false;
	}

	/**
	 * Get user role
	 */
	getUserRole(): User["role"] | null {
		const user = this.getStoredUser();
		return user?.role || null;
	}

	/**
	 * Change password (future implementation)
	 */
	async changePassword(
		currentPassword: string,
		newPassword: string
	): Promise<void> {
		const response = await apiClient.authenticatedRequest<ApiResponse>(
			"/auth/change-password",
			{
				method: "POST",
				body: JSON.stringify({ currentPassword, newPassword }),
			}
		);

		if (!response.success) {
			throw new Error("Failed to change password");
		}
	}

	/**
	 * Request password reset (future implementation)
	 */
	async requestPasswordReset(email: string): Promise<void> {
		const response = await apiClient.post<ApiResponse>(
			"/auth/forgot-password",
			{ email }
		);

		if (!response.success) {
			throw new Error("Failed to request password reset");
		}
	}

	/**
	 * Reset password with token (future implementation)
	 */
	async resetPassword(token: string, newPassword: string): Promise<void> {
		const response = await apiClient.post<ApiResponse>("/auth/reset-password", {
			token,
			password: newPassword,
		});

		if (!response.success) {
			throw new Error("Failed to reset password");
		}
	}
}

// Create singleton instance
export const authService = new AuthService();

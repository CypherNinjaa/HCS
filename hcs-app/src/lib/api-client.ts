import { ApiResponse, ApiError } from "@/types/auth";

// API configuration
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

// Custom error class for API errors
export class ApiClientError extends Error {
	public statusCode: number;
	public details?: Record<string, unknown> | string | null;

	constructor(
		message: string,
		statusCode: number,
		details?: Record<string, unknown> | string | null
	) {
		super(message);
		this.name = "ApiClientError";
		this.statusCode = statusCode;
		this.details = details;
	}
}

// Token management utilities
export const tokenStorage = {
	getAccessToken: (): string | null => {
		if (typeof window === "undefined") return null;
		return localStorage.getItem("accessToken");
	},

	getRefreshToken: (): string | null => {
		if (typeof window === "undefined") return null;
		return localStorage.getItem("refreshToken");
	},

	setTokens: (accessToken: string, refreshToken: string): void => {
		if (typeof window === "undefined") return;
		localStorage.setItem("accessToken", accessToken);
		localStorage.setItem("refreshToken", refreshToken);
	},

	clearTokens: (): void => {
		if (typeof window === "undefined") return;
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("user");
	},

	getExpiryTime: (): Date | null => {
		if (typeof window === "undefined") return null;
		const expiryTime = localStorage.getItem("tokenExpiryTime");
		return expiryTime ? new Date(expiryTime) : null;
	},

	setExpiryTime: (expiryTime: string): void => {
		if (typeof window === "undefined") return;
		localStorage.setItem("tokenExpiryTime", expiryTime);
	},

	isTokenExpired: (): boolean => {
		const expiryTime = tokenStorage.getExpiryTime();
		if (!expiryTime) return true;
		return new Date() >= expiryTime;
	},
};

// API client configuration
interface RequestConfig extends RequestInit {
	timeout?: number;
}

export class ApiClient {
	private baseURL: string;
	private defaultTimeout: number = 10000; // 10 seconds

	constructor(baseURL: string = API_BASE_URL) {
		this.baseURL = baseURL;
	}

	private async request<T>(
		endpoint: string,
		config: RequestConfig = {}
	): Promise<T> {
		const {
			timeout = this.defaultTimeout,
			headers: customHeaders,
			...restConfig
		} = config;

		// Prepare headers
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			...(customHeaders as Record<string, string>),
		};

		// Add authorization header if token exists and not expired
		const accessToken = tokenStorage.getAccessToken();
		if (accessToken && !tokenStorage.isTokenExpired()) {
			headers.Authorization = `Bearer ${accessToken}`;
		}

		// Create abort controller for timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			const response = await fetch(`${this.baseURL}${endpoint}`, {
				...restConfig,
				headers,
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			// Handle response
			const data = await response.json();

			if (!response.ok) {
				// Handle API errors
				const apiError = data as ApiError;
				throw new ApiClientError(
					apiError.message || "Request failed",
					response.status,
					apiError.details
				);
			}

			return data;
		} catch (error) {
			clearTimeout(timeoutId);

			if (error instanceof ApiClientError) {
				throw error;
			}

			if (error instanceof DOMException && error.name === "AbortError") {
				throw new ApiClientError("Request timeout", 408);
			}

			if (error instanceof TypeError) {
				throw new ApiClientError("Network error", 0);
			}

			throw new ApiClientError("Unknown error occurred", 500);
		}
	}

	// HTTP method helpers
	async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: "GET" });
	}

	async post<T>(
		endpoint: string,
		data?: unknown,
		config?: RequestConfig
	): Promise<T> {
		return this.request<T>(endpoint, {
			...config,
			method: "POST",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async put<T>(
		endpoint: string,
		data?: unknown,
		config?: RequestConfig
	): Promise<T> {
		return this.request<T>(endpoint, {
			...config,
			method: "PUT",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async patch<T>(
		endpoint: string,
		data?: unknown,
		config?: RequestConfig
	): Promise<T> {
		return this.request<T>(endpoint, {
			...config,
			method: "PATCH",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: "DELETE" });
	}

	// Token refresh logic
	async refreshToken(): Promise<boolean> {
		try {
			const refreshToken = tokenStorage.getRefreshToken();
			if (!refreshToken) {
				throw new Error("No refresh token available");
			}

			const response = await this.post<
				ApiResponse<{
					accessToken: string;
					refreshToken: string;
					expiresAt: string;
				}>
			>("/auth/refresh", { refreshToken });

			if (response.success && response.data) {
				tokenStorage.setTokens(
					response.data.accessToken,
					response.data.refreshToken
				);
				tokenStorage.setExpiryTime(response.data.expiresAt);
				return true;
			}

			return false;
		} catch {
			// If refresh fails, clear tokens
			tokenStorage.clearTokens();
			return false;
		}
	}

	// Authenticated request with automatic token refresh
	async authenticatedRequest<T>(
		endpoint: string,
		config?: RequestConfig
	): Promise<T> {
		try {
			// Try the request first
			return await this.request<T>(endpoint, config);
		} catch (error) {
			if (error instanceof ApiClientError && error.statusCode === 401) {
				// Token might be expired, try to refresh
				const refreshed = await this.refreshToken();

				if (refreshed) {
					// Retry the original request with new token
					return await this.request<T>(endpoint, config);
				} else {
					// Refresh failed, redirect to login or throw error
					tokenStorage.clearTokens();
					if (typeof window !== "undefined") {
						window.location.href = "/login";
					}
					throw error;
				}
			}

			throw error;
		}
	}
}

// Create singleton instance
export const apiClient = new ApiClient();

// Helper function for error handling in components
export const handleApiError = (error: unknown): string => {
	if (error instanceof ApiClientError) {
		return error.message;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return "An unexpected error occurred";
};

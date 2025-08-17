"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import { User } from "@/types/auth";
import { authService } from "@/lib/auth-service";
import { handleApiError } from "@/lib/api-client";

interface AuthContextType {
	// State
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	error: string | null;

	// Actions
	login: (email: string, password: string) => Promise<void>;
	register: (userData: {
		email: string;
		password: string;
		role: User["role"];
		firstName: string;
		lastName: string;
		middleName?: string;
	}) => Promise<void>;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
	clearError: () => void;

	// Role-based helpers
	hasRole: (role: User["role"]) => boolean;
	hasAnyRole: (roles: User["role"][]) => boolean;
	getUserRole: () => User["role"] | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const refreshUser = async () => {
		try {
			const userData = await authService.getCurrentUser();
			setUser(userData.user);
		} catch (error) {
			console.error("Refresh user error:", error);
			// If refresh fails and user was authenticated, clear auth state
			if (user) {
				setUser(null);
				await authService.logout();
			}
			throw error;
		}
	};

	// Initialize authentication state
	useEffect(() => {
		let isMounted = true;

		const initializeAuth = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// Check if user is already authenticated
				if (authService.isAuthenticated()) {
					const storedUser = authService.getStoredUser();

					if (storedUser && isMounted) {
						setUser(storedUser);

						// Optionally refresh user data from server
						try {
							const userData = await authService.getCurrentUser();
							if (isMounted) {
								setUser(userData.user);
							}
						} catch {
							// If refresh fails, keep the stored user data
							// The user will need to login again when token expires
						}
					}
				}
			} catch (error) {
				console.error("Auth initialization error:", error);
				if (isMounted) {
					setError(handleApiError(error));
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		initializeAuth();

		return () => {
			isMounted = false;
		};
	}, []); // Run only once on mount

	const login = async (email: string, password: string) => {
		try {
			setIsLoading(true);
			setError(null);

			const loginData = await authService.login({ email, password });
			setUser(loginData.user);
		} catch (error) {
			const errorMessage = handleApiError(error);
			setError(errorMessage);
			// Don't throw error - just set error state
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (userData: {
		email: string;
		password: string;
		role: User["role"];
		firstName: string;
		lastName: string;
		middleName?: string;
	}) => {
		try {
			setIsLoading(true);
			setError(null);

			const registerData = await authService.register(userData);
			setUser(registerData.user);
		} catch (error) {
			const errorMessage = handleApiError(error);
			setError(errorMessage);
			// Don't throw error - just set error state
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		try {
			setIsLoading(true);
			setError(null);

			await authService.logout();
			setUser(null);
		} catch (error) {
			// Even if logout fails on the server, clear local state
			console.error("Logout error:", error);
			setUser(null);
			setError(handleApiError(error));
		} finally {
			setIsLoading(false);
		}
	};

	const clearError = () => {
		setError(null);
	};

	const hasRole = (role: User["role"]) => {
		return authService.hasRole(role);
	};

	const hasAnyRole = (roles: User["role"][]) => {
		return authService.hasAnyRole(roles);
	};

	const getUserRole = () => {
		return authService.getUserRole();
	};

	const isAuthenticated = !!user && authService.isAuthenticated();

	const contextValue: AuthContextType = {
		// State
		user,
		isLoading,
		isAuthenticated,
		error,

		// Actions
		login,
		register,
		logout,
		refreshUser,
		clearError,

		// Role-based helpers
		hasRole,
		hasAnyRole,
		getUserRole,
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
}

// Custom hook to use auth context
export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

// Role-based hooks
export function useRequireAuth() {
	const { isAuthenticated, isLoading } = useAuth();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			window.location.href = "/login";
		}
	}, [isAuthenticated, isLoading]);

	return { isAuthenticated, isLoading };
}

export function useRequireRole(requiredRole: User["role"]) {
	const { hasRole, isLoading, isAuthenticated } = useAuth();

	useEffect(() => {
		if (!isLoading) {
			if (!isAuthenticated) {
				window.location.href = "/login";
			} else if (!hasRole(requiredRole)) {
				window.location.href = "/unauthorized";
			}
		}
	}, [hasRole, requiredRole, isLoading, isAuthenticated]);

	return { hasRole: hasRole(requiredRole), isLoading };
}

export function useRequireAnyRole(requiredRoles: User["role"][]) {
	const { hasAnyRole, isLoading, isAuthenticated } = useAuth();

	useEffect(() => {
		if (!isLoading) {
			if (!isAuthenticated) {
				window.location.href = "/login";
			} else if (!hasAnyRole(requiredRoles)) {
				window.location.href = "/unauthorized";
			}
		}
	}, [hasAnyRole, requiredRoles, isLoading, isAuthenticated]);

	return { hasAnyRole: hasAnyRole(requiredRoles), isLoading };
}

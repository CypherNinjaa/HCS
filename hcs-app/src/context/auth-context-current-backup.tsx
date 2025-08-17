"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

// Custom User type for our app
interface User {
	id: string;
	email: string;
	role: "admin" | "coordinator" | "teacher" | "student" | "parent" | "librarian" | "media_coordinator";
	status: "active" | "inactive" | "suspended" | "pending_verification";
	email_verified: boolean;
	first_name?: string;
	last_name?: string;
	avatar_url?: string;
}

interface AuthContextType {
	// State
	user: User | null;
	supabaseUser: SupabaseUser | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	error: string | null;

	// Actions
	signUp: (email: string, password: string, userData?: Record<string, unknown>) => Promise<void>;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
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
	const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Initialize authentication state
	useEffect(() => {
		// Get initial session
		const getInitialSession = async () => {
			try {
				const { data: { session }, error } = await supabase.auth.getSession();
				
				if (error) {
					console.error('Error getting session:', error);
					setError(error.message);
				}

				if (session?.user) {
					setSupabaseUser(session.user);
					await loadUserProfile(session.user);
				}
			} catch (error) {
				console.error('Session initialization error:', error);
				setError('Failed to initialize authentication');
			} finally {
				setIsLoading(false);
			}
		};

		getInitialSession();

		// Listen for auth changes
		const { data: { subscription } } = supabase.auth.onAuthStateChange(
			async (event, session) => {
				console.log('Auth state changed:', event, session?.user?.email);
				
				if (session?.user) {
					setSupabaseUser(session.user);
					await loadUserProfile(session.user);
				} else {
					setSupabaseUser(null);
					setUser(null);
				}
				
				setIsLoading(false);
			}
		);

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	const loadUserProfile = async (supabaseUser: SupabaseUser) => {
		try {
			// For now, create a basic user profile from Supabase user
			// Later, you can fetch additional profile data from your profiles table
			const userProfile: User = {
				id: supabaseUser.id,
				email: supabaseUser.email || '',
				role: 'student', // Default role - you'll want to fetch this from your database
				status: 'active',
				email_verified: !!supabaseUser.email_confirmed_at,
				first_name: supabaseUser.user_metadata?.first_name,
				last_name: supabaseUser.user_metadata?.last_name,
				avatar_url: supabaseUser.user_metadata?.avatar_url,
			};

			setUser(userProfile);
		} catch (error) {
			console.error('Error loading user profile:', error);
			setError('Failed to load user profile');
		}
	};

	const signUp = async (email: string, password: string, userData?: Record<string, unknown>) => {
		try {
			setIsLoading(true);
			setError(null);

			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: userData || {}
				}
			});

			if (error) {
				throw error;
			}

			// User will be set via the auth state change listener
		} catch (error: unknown) {
			console.error('Sign up error:', error);
			const errorMessage = error instanceof Error ? error.message : 'Failed to sign up';
			setError(errorMessage);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const signIn = async (email: string, password: string) => {
		try {
			setIsLoading(true);
			setError(null);

			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				throw error;
			}

			// User will be set via the auth state change listener
		} catch (error: unknown) {
			console.error('Sign in error:', error);
			const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
			setError(errorMessage);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const signOut = async () => {
		try {
			setIsLoading(true);
			setError(null);

			const { error } = await supabase.auth.signOut();

			if (error) {
				throw error;
			}

			// User will be cleared via the auth state change listener
		} catch (error: unknown) {
			console.error('Sign out error:', error);
			const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const clearError = () => {
		setError(null);
	};

	const hasRole = (role: User["role"]) => {
		return user?.role === role;
	};

	const hasAnyRole = (roles: User["role"][]) => {
		return roles.includes(user?.role as User["role"]);
	};

	const getUserRole = () => {
		return user?.role || null;
	};

	const isAuthenticated = !!user && !!supabaseUser;

	const contextValue: AuthContextType = {
		// State
		user,
		supabaseUser,
		isLoading,
		isAuthenticated,
		error,

		// Actions
		signUp,
		signIn,
		signOut,
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

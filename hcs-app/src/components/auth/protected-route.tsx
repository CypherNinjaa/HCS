"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { User } from "@/types/auth";

interface ProtectedRouteProps {
	children: ReactNode;
	requiredRole?: User["role"];
	requiredRoles?: User["role"][];
	fallbackPath?: string;
}

export function ProtectedRoute({
	children,
	requiredRole,
	requiredRoles,
	fallbackPath = "/login",
}: ProtectedRouteProps) {
	const { isAuthenticated, isLoading, user, hasRole, hasAnyRole } = useAuth();
	const router = useRouter();

	// Show loading state while checking authentication
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Checking authentication...</p>
				</div>
			</div>
		);
	}

	// Redirect to login if not authenticated
	if (!isAuthenticated) {
		router.push(fallbackPath);
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<p className="text-gray-600">Redirecting to login...</p>
				</div>
			</div>
		);
	}

	// Check specific role requirement
	if (requiredRole && !hasRole(requiredRole)) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center max-w-md mx-auto">
					<div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
						<div className="text-red-600 text-2xl">🚫</div>
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Access Denied
					</h2>
					<p className="text-gray-600 mb-4">
						You don&apos;t have permission to access this page. Required role:{" "}
						{requiredRole}
					</p>
					<p className="text-sm text-gray-500 mb-4">
						Your current role: {user?.role}
					</p>
					<button
						onClick={() => router.back()}
						className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Go Back
					</button>
				</div>
			</div>
		);
	}

	// Check multiple roles requirement
	if (requiredRoles && !hasAnyRole(requiredRoles)) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center max-w-md mx-auto">
					<div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
						<div className="text-red-600 text-2xl">🚫</div>
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Access Denied
					</h2>
					<p className="text-gray-600 mb-4">
						You don&apos;t have permission to access this page. Required roles:{" "}
						{requiredRoles.join(", ")}
					</p>
					<p className="text-sm text-gray-500 mb-4">
						Your current role: {user?.role}
					</p>
					<button
						onClick={() => router.back()}
						className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Go Back
					</button>
				</div>
			</div>
		);
	}

	// User is authenticated and has required permissions
	return <>{children}</>;
}

// Convenience wrapper for admin-only pages
export function AdminRoute({ children }: { children: ReactNode }) {
	return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
}

// Convenience wrapper for teacher-accessible pages
export function TeacherRoute({ children }: { children: ReactNode }) {
	return (
		<ProtectedRoute requiredRoles={["admin", "coordinator", "teacher"]}>
			{children}
		</ProtectedRoute>
	);
}

// Convenience wrapper for student-accessible pages
export function StudentRoute({ children }: { children: ReactNode }) {
	return <ProtectedRoute requiredRole="student">{children}</ProtectedRoute>;
}

// Convenience wrapper for parent-accessible pages
export function ParentRoute({ children }: { children: ReactNode }) {
	return <ProtectedRoute requiredRole="parent">{children}</ProtectedRoute>;
}

// Convenience wrapper for staff-accessible pages (admin, coordinator, teacher)
export function StaffRoute({ children }: { children: ReactNode }) {
	return (
		<ProtectedRoute
			requiredRoles={[
				"admin",
				"coordinator",
				"teacher",
				"librarian",
				"media_coordinator",
			]}
		>
			{children}
		</ProtectedRoute>
	);
}

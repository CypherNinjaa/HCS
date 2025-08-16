"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { User } from "@/types/auth";

interface RoleGuardProps {
	children: ReactNode;
	allowedRoles: User["role"][];
	fallbackComponent?: ReactNode;
	redirectTo?: string;
	showError?: boolean;
}

export function RoleGuard({
	children,
	allowedRoles,
	fallbackComponent,
	redirectTo,
	showError = true,
}: RoleGuardProps) {
	const { user, isAuthenticated, isLoading, hasAnyRole } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (
			!isLoading &&
			isAuthenticated &&
			!hasAnyRole(allowedRoles) &&
			redirectTo
		) {
			router.push(redirectTo);
		}
	}, [
		isLoading,
		isAuthenticated,
		hasAnyRole,
		allowedRoles,
		redirectTo,
		router,
	]);

	// Still loading
	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-4">
				<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	// Not authenticated
	if (!isAuthenticated) {
		return null;
	}

	// User doesn't have required role
	if (!hasAnyRole(allowedRoles)) {
		if (fallbackComponent) {
			return <>{fallbackComponent}</>;
		}

		if (!showError) {
			return null;
		}

		return (
			<div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
				<div className="flex">
					<div className="ml-3">
						<h3 className="text-sm font-medium text-yellow-800">
							Access Restricted
						</h3>
						<div className="mt-2 text-sm text-yellow-700">
							<p>
								This content is only available to users with the following
								roles: {allowedRoles.join(", ")}
							</p>
							<p className="mt-1">Your current role: {user?.role}</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}

// Specific role guards for common use cases
export function AdminOnly({
	children,
	fallbackComponent,
}: {
	children: ReactNode;
	fallbackComponent?: ReactNode;
}) {
	return (
		<RoleGuard allowedRoles={["admin"]} fallbackComponent={fallbackComponent}>
			{children}
		</RoleGuard>
	);
}

export function StaffOnly({
	children,
	fallbackComponent,
}: {
	children: ReactNode;
	fallbackComponent?: ReactNode;
}) {
	return (
		<RoleGuard
			allowedRoles={[
				"admin",
				"coordinator",
				"teacher",
				"librarian",
				"media_coordinator",
			]}
			fallbackComponent={fallbackComponent}
		>
			{children}
		</RoleGuard>
	);
}

export function TeacherOnly({
	children,
	fallbackComponent,
}: {
	children: ReactNode;
	fallbackComponent?: ReactNode;
}) {
	return (
		<RoleGuard
			allowedRoles={["admin", "coordinator", "teacher"]}
			fallbackComponent={fallbackComponent}
		>
			{children}
		</RoleGuard>
	);
}

export function StudentOnly({
	children,
	fallbackComponent,
}: {
	children: ReactNode;
	fallbackComponent?: ReactNode;
}) {
	return (
		<RoleGuard allowedRoles={["student"]} fallbackComponent={fallbackComponent}>
			{children}
		</RoleGuard>
	);
}

export function ParentOnly({
	children,
	fallbackComponent,
}: {
	children: ReactNode;
	fallbackComponent?: ReactNode;
}) {
	return (
		<RoleGuard allowedRoles={["parent"]} fallbackComponent={fallbackComponent}>
			{children}
		</RoleGuard>
	);
}

"use client";

import React from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { UserWithProfile } from "@/types/auth";

export function LogoutButton({ className = "" }: { className?: string }) {
	const { signOut, user } = useAuth();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await signOut();
			router.push("/login");
		} catch (error) {
			console.error("Logout failed:", error);
			// Force logout even if API call fails
			router.push("/login");
		}
	};

	if (!user) return null;

	return (
		<button
			onClick={handleLogout}
			className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${className}`}
		>
			Logout
		</button>
	);
}

export function UserProfile({ showRole = true }: { showRole?: boolean }) {
	const { user } = useAuth();

	if (!user) return null;

	const userWithProfile = user as UserWithProfile;
	const displayName = userWithProfile.profile
		? `${userWithProfile.profile.first_name} ${userWithProfile.profile.last_name}`.trim()
		: userWithProfile.email.split("@")[0];

	const initials = userWithProfile.profile
		? `${userWithProfile.profile.first_name?.charAt(0) || ""}${
				userWithProfile.profile.last_name?.charAt(0) || ""
		  }`.toUpperCase()
		: userWithProfile.email.charAt(0).toUpperCase();

	return (
		<div className="flex items-center space-x-3">
			<div className="flex-shrink-0">
				<div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
					<span className="text-sm font-medium text-white">
						{initials || "U"}
					</span>
				</div>
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium text-gray-900 truncate">
					{displayName}
				</p>
				{showRole && (
					<p className="text-xs text-gray-500 capitalize">
						{user.role?.replace("_", " ")}
					</p>
				)}
			</div>
		</div>
	);
}

export function AuthStatus() {
	const { isAuthenticated, isLoading, user } = useAuth();

	if (isLoading) {
		return (
			<div className="flex items-center space-x-2">
				<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
				<span className="text-sm text-gray-600">
					Checking authentication...
				</span>
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<div className="flex items-center space-x-2">
				<div className="h-2 w-2 bg-red-500 rounded-full"></div>
				<span className="text-sm text-gray-600">Not authenticated</span>
			</div>
		);
	}

	return (
		<div className="flex items-center space-x-2">
			<div className="h-2 w-2 bg-green-500 rounded-full"></div>
			<span className="text-sm text-gray-600">
				Authenticated as {user?.email.split("@")[0]}
			</span>
		</div>
	);
}

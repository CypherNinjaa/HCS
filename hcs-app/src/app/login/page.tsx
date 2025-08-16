"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { User } from "@/types/auth";

// Login form validation schema
const loginSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Role-based redirect mapping
const roleRedirects: Record<User["role"], string> = {
	admin: "/dashboard/admin",
	coordinator: "/dashboard/coordinator",
	teacher: "/dashboard/teacher",
	student: "/dashboard/student",
	parent: "/dashboard/parent",
	librarian: "/dashboard/librarian",
	media_coordinator: "/dashboard/media-coordinator",
};

export default function LoginPage() {
	const router = useRouter();
	const { login, isAuthenticated, isLoading, error, clearError, user } =
		useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated && user) {
			const redirectPath = roleRedirects[user.role] || "/dashboard";
			router.push(redirectPath);
		}
	}, [isAuthenticated, user, router]);

	// Clear errors when component mounts
	useEffect(() => {
		clearError();
	}, [clearError]);

	const onSubmit = async (data: LoginFormData) => {
		try {
			setIsSubmitting(true);
			clearError();

			await login(data.email, data.password);

			// Success - redirect will happen in useEffect above
			reset();
		} catch (error) {
			// Error is already handled by the auth context
			console.error("Login failed:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Show loading state while checking authentication
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<div className="flex justify-center">
						<div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-xl">HCS</span>
						</div>
					</div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Sign in to your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Enter your credentials to access your portal
					</p>
				</div>

				<div className="mt-8 space-y-6">
					{/* Error Display */}
					{error && (
						<div className="bg-red-50 border border-red-200 rounded-md p-4">
							<div className="flex">
								<div className="ml-3">
									<h3 className="text-sm font-medium text-red-800">
										Login Failed
									</h3>
									<div className="mt-2 text-sm text-red-700">{error}</div>
								</div>
							</div>
						</div>
					)}

					{/* Login Form */}
					<form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
						<div className="space-y-4">
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700"
								>
									Email Address
								</label>
								<Input
									id="email"
									type="email"
									autoComplete="email"
									placeholder="Enter your email address"
									className={`mt-1 ${errors.email ? "border-red-300" : ""}`}
									{...register("email")}
								/>
								{errors.email && (
									<p className="mt-1 text-sm text-red-600">
										{errors.email.message}
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700"
								>
									Password
								</label>
								<Input
									id="password"
									type="password"
									autoComplete="current-password"
									placeholder="Enter your password"
									className={`mt-1 ${errors.password ? "border-red-300" : ""}`}
									{...register("password")}
								/>
								{errors.password && (
									<p className="mt-1 text-sm text-red-600">
										{errors.password.message}
									</p>
								)}
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="text-sm">
								<Link
									href="/forgot-password"
									className="font-medium text-blue-600 hover:text-blue-500"
								>
									Forgot your password?
								</Link>
							</div>
						</div>

						<div>
							<Button
								type="submit"
								className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Signing in...
									</>
								) : (
									"Sign in"
								)}
							</Button>
						</div>
					</form>

					{/* Demo Credentials */}
					<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
						<h3 className="text-sm font-medium text-blue-800 mb-2">
							Demo Credentials:
						</h3>
						<div className="text-xs text-blue-700 space-y-1">
							<p>
								<strong>Admin:</strong> admin@happychildschool.com /
								Admin@123456
							</p>
							<p>
								<strong>Teacher:</strong> teacher@happychildschool.com /
								Teacher@123456
							</p>
						</div>
					</div>

					<div className="text-center">
						<p className="text-sm text-gray-600">
							New to Happy Child School?{" "}
							<Link
								href="/admissions"
								className="font-medium text-blue-600 hover:text-blue-500"
							>
								Apply for admission
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

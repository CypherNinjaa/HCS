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
import {
	BookOpen,
	GraduationCap,
	Users,
	Star,
	Eye,
	EyeOff,
	Mail,
	Lock,
	Sparkles,
	Heart,
	Shield,
} from "lucide-react";

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
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
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

	// Quick demo login functions
	const fillDemoCredentials = (email: string, password: string) => {
		setValue("email", email);
		setValue("password", password);
	};

	// Show loading state while checking authentication
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center gradient-primary">
				<div className="text-center">
					<div className="relative">
						<div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mx-auto"></div>
						<GraduationCap className="absolute inset-0 m-auto h-8 w-8 text-white animate-pulse" />
					</div>
					<p className="mt-6 text-white text-lg font-medium">
						Loading your portal...
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<style
				dangerouslySetInnerHTML={{
					__html: `
					/* Ensure input text is always visible */
					input[type="email"],
					input[type="password"],
					input[type="text"] {
						color: #1f2937 !important;
						background-color: #ffffff !important;
					}
					
					input[type="email"]::placeholder,
					input[type="password"]::placeholder,
					input[type="text"]::placeholder {
						color: #6b7280 !important;
						opacity: 0.8;
					}
					
					/* Ensure input text remains visible when typing */
					input[type="email"]:focus,
					input[type="password"]:focus,
					input[type="text"]:focus {
						color: #111827 !important;
						background-color: #ffffff !important;
					}
				`,
				}}
			/>

			<div className="min-h-screen relative overflow-hidden">
				{/* Animated Background */}
				<div className="absolute inset-0 gradient-primary">
					<div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>

					{/* Floating School Elements */}
					<div className="absolute top-20 left-10 animate-float">
						<BookOpen className="h-12 w-12 text-white/30" />
					</div>
					<div
						className="absolute top-40 right-20 animate-float"
						style={{ animationDelay: "1s" }}
					>
						<GraduationCap className="h-16 w-16 text-white/30" />
					</div>
					<div
						className="absolute bottom-40 left-20 animate-float"
						style={{ animationDelay: "2s" }}
					>
						<Users className="h-10 w-10 text-white/30" />
					</div>
					<div
						className="absolute bottom-20 right-10 animate-float"
						style={{ animationDelay: "0.5s" }}
					>
						<Star className="h-8 w-8 text-white/30" />
					</div>

					{/* Grid Pattern */}
					<div
						className="absolute inset-0 bg-white/5"
						style={{
							backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
							backgroundSize: "50px 50px",
						}}
					></div>
				</div>

				{/* Main Content */}
				<div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
					<div className="max-w-md w-full">
						{/* School Header */}
						<div className="text-center mb-8 animate-slide-up">
							<div className="flex justify-center mb-6">
								<div className="relative">
									<div className="h-20 w-20 bg-white rounded-2xl shadow-xl flex items-center justify-center group hover:scale-105 transition-transform duration-300">
										<span className="text-3xl font-bold text-gradient-primary">
											HCS
										</span>
									</div>
									<div className="absolute -top-2 -right-2">
										<div className="h-6 w-6 bg-gradient-accent rounded-full flex items-center justify-center animate-pulse">
											<Sparkles className="h-3 w-3 text-white" />
										</div>
									</div>
								</div>
							</div>

							<h1 className="text-4xl font-bold text-white mb-2">
								Welcome to
								<span className="block text-gradient-accent">
									Happy Child School
								</span>
							</h1>
							<p className="text-white/80 text-lg">
								🌟 Where Every Child Shines Bright 🌟
							</p>
						</div>

						{/* Login Card */}
						<div
							className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 animate-slide-up border border-white/20"
							style={{ animationDelay: "0.2s" }}
						>
							{/* School Stats */}
							<div className="grid grid-cols-3 gap-4 mb-8 text-center">
								<div className="bg-gradient-primary rounded-xl p-3 text-white">
									<div className="text-2xl font-bold">1500+</div>
									<div className="text-xs opacity-90">Students</div>
								</div>
								<div className="bg-gradient-accent rounded-xl p-3 text-white">
									<div className="text-2xl font-bold">50+</div>
									<div className="text-xs opacity-90">Teachers</div>
								</div>
								<div className="bg-gradient-warm rounded-xl p-3 text-white">
									<div className="text-2xl font-bold">15+</div>
									<div className="text-xs opacity-90">Years</div>
								</div>
							</div>

							<div className="text-center mb-6">
								<h2 className="text-2xl font-bold text-gray-800 mb-2">
									Sign in to your portal
								</h2>
								<p className="text-gray-600">
									Enter your credentials to access your learning journey
								</p>
							</div>

							{/* Error Display */}
							{error && (
								<div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg animate-slide-up">
									<div className="flex items-center">
										<Shield className="h-5 w-5 text-red-400 mr-2" />
										<div>
											<h3 className="text-sm font-medium text-red-800">
												Login Failed
											</h3>
											<div className="mt-1 text-sm text-red-700">{error}</div>
										</div>
									</div>
								</div>
							)}

							{/* Login Form */}
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
								{/* Email Field */}
								<div className="space-y-2">
									<label
										htmlFor="email"
										className="flex items-center text-sm font-semibold text-gray-700"
									>
										<Mail className="h-4 w-4 mr-2 text-blue-500" />
										Email Address
									</label>
									<div className="relative">
										<Input
											id="email"
											type="email"
											autoComplete="email"
											placeholder="Enter your school email"
											style={{
												color: "#1f2937",
												backgroundColor: "#ffffff",
											}}
											className={`h-14 pl-12 pr-4 text-lg border-2 rounded-xl transition-all duration-300 focus:scale-[1.02] bg-white text-gray-900 placeholder:text-gray-500 ${
												errors.email
													? "border-red-300 focus:border-red-500 focus:ring-red-200"
													: "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
											}`}
											{...register("email")}
										/>
										<Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
									</div>
									{errors.email && (
										<p className="text-sm text-red-600 flex items-center animate-slide-up">
											<span className="mr-1">⚠️</span>
											{errors.email.message}
										</p>
									)}
								</div>

								{/* Password Field */}
								<div className="space-y-2">
									<label
										htmlFor="password"
										className="flex items-center text-sm font-semibold text-gray-700"
									>
										<Lock className="h-4 w-4 mr-2 text-blue-500" />
										Password
									</label>
									<div className="relative">
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											autoComplete="current-password"
											placeholder="Enter your password"
											style={{
												color: "#1f2937",
												backgroundColor: "#ffffff",
											}}
											className={`h-14 pl-12 pr-12 text-lg border-2 rounded-xl transition-all duration-300 focus:scale-[1.02] bg-white text-gray-900 placeholder:text-gray-500 ${
												errors.password
													? "border-red-300 focus:border-red-500 focus:ring-red-200"
													: "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
											}`}
											{...register("password")}
										/>
										<Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
										>
											{showPassword ? (
												<EyeOff className="h-5 w-5" />
											) : (
												<Eye className="h-5 w-5" />
											)}
										</button>
									</div>
									{errors.password && (
										<p className="text-sm text-red-600 flex items-center animate-slide-up">
											<span className="mr-1">⚠️</span>
											{errors.password.message}
										</p>
									)}
								</div>

								{/* Forgot Password */}
								<div className="text-right">
									<Link
										href="/forgot-password"
										className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
									>
										Forgot your password? 🔑
									</Link>
								</div>

								{/* Login Button */}
								<Button
									type="submit"
									disabled={isSubmitting}
									className="w-full h-14 text-lg font-semibold rounded-xl gradient-primary hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isSubmitting ? (
										<>
											<div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white mr-3"></div>
											Signing you in...
										</>
									) : (
										<>
											<Heart className="mr-2 h-5 w-5" />
											Sign in to Learn
										</>
									)}
								</Button>
							</form>

							{/* Demo Credentials */}
							<div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
								<h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
									<Sparkles className="h-4 w-4 mr-2 text-blue-500" />
									Quick Demo Access 🚀
								</h3>
								<div className="space-y-3">
									<button
										type="button"
										onClick={() =>
											fillDemoCredentials(
												"admin@happychildschool.com",
												"Admin@123456"
											)
										}
										className="w-full p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 text-left group"
									>
										<div className="flex items-center justify-between">
											<div>
												<div className="text-sm font-semibold text-gray-800">
													👨‍💼 Admin Portal
												</div>
												<div className="text-xs text-gray-600">
													Manage school operations
												</div>
											</div>
											<div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
												Click to fill →
											</div>
										</div>
									</button>

									<button
										type="button"
										onClick={() =>
											fillDemoCredentials(
												"john.doe.test@gmail.com",
												"student123"
											)
										}
										className="w-full p-3 bg-white rounded-lg border border-green-200 hover:border-green-400 hover:shadow-md transition-all duration-200 text-left group"
									>
										<div className="flex items-center justify-between">
											<div>
												<div className="text-sm font-semibold text-gray-800">
													🎓 Student Portal
												</div>
												<div className="text-xs text-gray-600">
													Access assignments & grades
												</div>
											</div>
											<div className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
												Click to fill →
											</div>
										</div>
									</button>

									<button
										type="button"
										onClick={() =>
											fillDemoCredentials(
												"parent.john.test@gmail.com",
												"parent123"
											)
										}
										className="w-full p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all duration-200 text-left group"
									>
										<div className="flex items-center justify-between">
											<div>
												<div className="text-sm font-semibold text-gray-800">
													👨‍👩‍👧‍👦 Parent Portal
												</div>
												<div className="text-xs text-gray-600">
													Track your child&apos;s progress
												</div>
											</div>
											<div className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
												Click to fill →
											</div>
										</div>
									</button>
								</div>
							</div>

							{/* Admission Link */}
							<div className="mt-6 text-center">
								<p className="text-sm text-gray-600">
									New to Happy Child School?
									<Link
										href="/admissions"
										className="ml-1 font-semibold text-blue-600 hover:text-blue-800 transition-colors"
									>
										Apply for admission 🎒
									</Link>
								</p>
							</div>
						</div>

						{/* School Values */}
						<div
							className="mt-8 text-center text-white/80 animate-slide-up"
							style={{ animationDelay: "0.4s" }}
						>
							<p className="text-sm">
								🌟 Excellence • 💝 Compassion • 🚀 Innovation • 🤝 Community 🌟
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

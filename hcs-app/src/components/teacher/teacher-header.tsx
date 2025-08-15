"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
	Search,
	Bell,
	Menu,
	X,
	ChevronDown,
	User,
	Settings,
	LogOut,
	BookOpen,
	Users,
	Calendar,
	Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

interface TeacherData {
	id: string;
	name: string;
	email: string;
	phone: string;
	profilePicture: string;
	employeeId: string;
	department: string;
	designation: string;
	joiningDate: string;
	subjects: string[];
	classes: Array<{
		id: string;
		name: string;
		section: string;
		students: number;
		subjects: string[];
	}>;
}

interface TeacherHeaderProps {
	teacherData: TeacherData;
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
}

export function TeacherHeader({
	teacherData,
	sidebarOpen,
	setSidebarOpen,
}: TeacherHeaderProps) {
	const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
	const [quickStatsOpen, setQuickStatsOpen] = useState(false);
	const [notificationCount] = useState(8);

	// Quick stats data
	const quickStats = {
		totalClasses: teacherData.classes.length,
		totalStudents: teacherData.classes.reduce(
			(acc, cls) => acc + cls.students,
			0
		),
		pendingAssignments: 12,
		upcomingClasses: 3,
	};

	return (
		<header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
			<div className="flex h-16 items-center justify-between px-4 md:px-6">
				{/* Left Section */}
				<div className="flex items-center space-x-4">
					{/* Mobile Menu Button */}
					<Button
						variant="ghost"
						size="sm"
						className="md:hidden p-2"
						onClick={() => setSidebarOpen(!sidebarOpen)}
					>
						{sidebarOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Menu className="h-5 w-5" />
						)}
					</Button>

					{/* Logo and Title */}
					<div className="flex items-center space-x-3">
						<div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
							<BookOpen className="w-6 h-6 text-white" />
						</div>
						<div className="hidden sm:block">
							<h1 className="text-xl font-bold text-gray-900 dark:text-white">
								Teacher Portal
							</h1>
							<p className="text-xs text-gray-600 dark:text-gray-400">
								Welcome back, {teacherData.name.split(" ")[0]}!
							</p>
						</div>
					</div>
				</div>

				{/* Center Section - Quick Stats */}
				<div className="hidden lg:flex items-center space-x-6">
					<motion.div whileHover={{ scale: 1.05 }} className="relative">
						<button
							onClick={() => setQuickStatsOpen(!quickStatsOpen)}
							className="flex items-center space-x-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
						>
							<div className="flex items-center space-x-2">
								<Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
								<div className="text-left">
									<p className="text-sm font-medium text-blue-900 dark:text-blue-100">
										{quickStats.totalClasses} Classes
									</p>
									<p className="text-xs text-blue-600 dark:text-blue-400">
										{quickStats.totalStudents} Students
									</p>
								</div>
							</div>
							<ChevronDown className="w-4 h-4 text-blue-500" />
						</button>

						{/* Quick Stats Dropdown */}
						{quickStatsOpen && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								className="absolute top-full mt-2 left-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-3 z-50"
							>
								<div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										Quick Overview
									</p>
								</div>
								<div className="px-4 py-3 space-y-3">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<Calendar className="w-4 h-4 text-green-500" />
											<span className="text-sm text-gray-600 dark:text-gray-400">
												Upcoming Classes
											</span>
										</div>
										<span className="text-sm font-medium text-gray-900 dark:text-white">
											{quickStats.upcomingClasses}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<BookOpen className="w-4 h-4 text-orange-500" />
											<span className="text-sm text-gray-600 dark:text-gray-400">
												Pending Assignments
											</span>
										</div>
										<span className="text-sm font-medium text-gray-900 dark:text-white">
											{quickStats.pendingAssignments}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<Award className="w-4 h-4 text-purple-500" />
											<span className="text-sm text-gray-600 dark:text-gray-400">
												Subjects Teaching
											</span>
										</div>
										<span className="text-sm font-medium text-gray-900 dark:text-white">
											{teacherData.subjects.length}
										</span>
									</div>
								</div>
							</motion.div>
						)}
					</motion.div>
				</div>

				{/* Right Section */}
				<div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-shrink-0">
					{/* Search */}
					<div className="hidden lg:block relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Search students, classes..."
							className="pl-10 pr-4 py-2 w-48 xl:w-64 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					{/* Notifications */}
					<Button
						variant="ghost"
						size="sm"
						className="relative p-2 flex-shrink-0"
					>
						<Bell className="h-5 w-5" />
						{notificationCount > 0 && (
							<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
								{notificationCount}
							</span>
						)}
					</Button>

					{/* Theme Toggle */}
					<div className="flex-shrink-0">
						<ThemeToggle />
					</div>

					{/* Teacher Profile */}
					<div className="relative flex-shrink-0">
						<button
							onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
							className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
						>
							<Image
								src={teacherData.profilePicture || "/default-profile.svg"}
								alt={teacherData.name}
								width={32}
								height={32}
								className="w-8 h-8 rounded-full object-cover flex-shrink-0"
							/>
							<div className="hidden xl:block text-left min-w-0">
								<p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
									{teacherData.name}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
									{teacherData.designation}
								</p>
							</div>
							<ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 hidden xl:block" />
						</button>

						{/* Profile Dropdown */}
						{profileDropdownOpen && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								className="absolute top-full mt-2 right-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
							>
								{/* Profile Info */}
								<div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
									<div className="flex items-center space-x-3">
										<Image
											src={teacherData.profilePicture || "/default-profile.svg"}
											alt={teacherData.name}
											width={40}
											height={40}
											className="w-10 h-10 rounded-full object-cover"
										/>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-900 dark:text-white truncate">
												{teacherData.name}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
												{teacherData.email}
											</p>
											<p className="text-xs text-blue-600 dark:text-blue-400">
												ID: {teacherData.employeeId}
											</p>
										</div>
									</div>
								</div>

								{/* Menu Items */}
								<div className="py-2">
									<button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
										<User className="w-4 h-4 text-gray-500" />
										<span className="text-sm text-gray-700 dark:text-gray-300">
											My Profile
										</span>
									</button>
									<button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
										<Settings className="w-4 h-4 text-gray-500" />
										<span className="text-sm text-gray-700 dark:text-gray-300">
											Settings
										</span>
									</button>
									<hr className="my-2 border-gray-200 dark:border-gray-700" />
									<button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400">
										<LogOut className="w-4 h-4" />
										<span className="text-sm">Log Out</span>
									</button>
								</div>
							</motion.div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}

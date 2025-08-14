"use client";

import { motion } from "framer-motion";
import { Bell, Menu, User, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ThemeToggle } from "../theme-toggle";

interface CoordinatorData {
	id: string;
	name: string;
	email: string;
	phone: string;
	profilePicture: string;
	employeeId: string;
	department: string;
	designation: string;
	joiningDate: string;
	permissions: string[];
}

interface CoordinatorHeaderProps {
	coordinatorData: CoordinatorData;
	onMenuClick: () => void;
}

export function CoordinatorHeader({
	coordinatorData,
	onMenuClick,
}: CoordinatorHeaderProps) {
	const [imageError, setImageError] = useState(false);

	return (
		<header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
			<div className="px-4 lg:px-6">
				<div className="flex items-center justify-between h-16">
					{/* Left side - Menu button and title */}
					<div className="flex items-center gap-4">
						<button
							onClick={onMenuClick}
							className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
						>
							<Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
						</button>

						<div className="flex items-center gap-3">
							<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-sm">SC</span>
							</div>
							<div className="hidden sm:block">
								<h1 className="text-xl font-bold text-gray-900 dark:text-white">
									Student Coordinator Portal
								</h1>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{coordinatorData.department}
								</p>
							</div>
						</div>
					</div>

					{/* Right side - Actions and profile */}
					<div className="flex items-center gap-3">
						{/* Theme Toggle */}
						<ThemeToggle />

						{/* Notifications */}
						<button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
							<Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
							<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
								3
							</span>
						</button>

						{/* Profile Dropdown */}
						<div className="relative group">
							<button className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
								<div className="hidden sm:flex flex-col items-end">
									<span className="text-sm font-medium text-gray-900 dark:text-white">
										{coordinatorData.name}
									</span>
									<span className="text-xs text-gray-500 dark:text-gray-400">
										{coordinatorData.designation}
									</span>
								</div>
								<Image
									src={
										imageError
											? "/default-profile.svg"
											: coordinatorData.profilePicture || "/default-profile.svg"
									}
									alt={coordinatorData.name}
									width={32}
									height={32}
									className="rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
									onError={() => setImageError(true)}
								/>
							</button>

							{/* Dropdown Menu */}
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 0, y: -10 }}
								whileHover={{ opacity: 1, y: 0 }}
								className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50"
							>
								<div className="p-2">
									<button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
										<User className="h-4 w-4" />
										View Profile
									</button>
									<button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
										<Settings className="h-4 w-4" />
										Settings
									</button>
									<hr className="my-2 border-gray-200 dark:border-gray-600" />
									<button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
										<LogOut className="h-4 w-4" />
										Sign Out
									</button>
								</div>
							</motion.div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}

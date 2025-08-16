"use client";

import { motion } from "framer-motion";
import {
	Menu,
	Bell,
	Search,
	Settings,
	LogOut,
	Shield,
	Globe,
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

interface AdminHeaderProps {
	isSidebarOpen: boolean;
	setIsSidebarOpen: (open: boolean) => void;
}

export function AdminHeader({
	isSidebarOpen,
	setIsSidebarOpen,
}: AdminHeaderProps) {
	const [notifications] = useState(5);
	const [showNotifications, setShowNotifications] = useState(false);

	return (
		<header className="fixed top-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-lg border-b border-border z-50">
			<div className="h-full px-4 flex items-center justify-between">
				{/* Left section */}
				<div className="flex items-center gap-4">
					<button
						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
						className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
					>
						<Menu className="h-5 w-5 text-muted-foreground" />
					</button>

					<div className="flex items-center gap-3">
						<div className="w-8 h-8 bg-gradient-to-r from-red-500 to-purple-600 rounded-lg flex items-center justify-center">
							<Shield className="h-5 w-5 text-white" />
						</div>
						<div className="hidden sm:block">
							<h1 className="font-bold text-foreground">Admin Panel</h1>
							<p className="text-xs text-muted-foreground">
								Central Management Hub
							</p>
						</div>
					</div>
				</div>

				{/* Center section - Search */}
				<div className="flex-1 max-w-xl mx-4 relative">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<input
							type="text"
							placeholder="Search students, teachers, or data..."
							className="w-full pl-10 pr-4 py-2 bg-muted border-0 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-sm text-foreground placeholder:text-muted-foreground"
						/>
					</div>
				</div>

				{/* Right section */}
				<div className="flex items-center gap-2">
					{/* Language Toggle */}
					<button className="hidden sm:flex p-2 rounded-lg hover:bg-muted transition-colors">
						<Globe className="h-5 w-5 text-muted-foreground" />
					</button>

					{/* Notifications */}
					<div className="relative">
						<button
							onClick={() => setShowNotifications(!showNotifications)}
							className="relative p-2 rounded-lg hover:bg-muted transition-colors"
						>
							<Bell className="h-5 w-5 text-muted-foreground" />
							{notifications > 0 && (
								<span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
									{notifications}
								</span>
							)}
						</button>

						{/* Notifications Dropdown */}
						{showNotifications && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								className="absolute right-0 top-12 w-80 bg-card rounded-lg shadow-lg border border-border z-50"
							>
								<div className="p-4 border-b border-border">
									<h3 className="font-semibold text-foreground">
										Notifications
									</h3>
								</div>
								<div className="max-h-64 overflow-y-auto">
									{[1, 2, 3, 4, 5].map((i) => (
										<div
											key={i}
											className="p-3 border-b border-border last:border-b-0 hover:bg-muted"
										>
											<p className="text-sm font-medium text-foreground">
												New student registration
											</p>
											<p className="text-xs text-muted-foreground mt-1">
												Student ID: STU2025{i.toString().padStart(3, "0")} needs
												approval
											</p>
											<p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
												2 minutes ago
											</p>
										</div>
									))}
								</div>
								<div className="p-3 text-center">
									<button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
										View all notifications
									</button>
								</div>
							</motion.div>
						)}
					</div>

					{/* Settings */}
					<button className="p-2 rounded-lg hover:bg-muted transition-colors">
						<Settings className="h-5 w-5 text-muted-foreground" />
					</button>

					{/* Theme Toggle */}
					<ThemeToggle />

					{/* Theme Force Refresh - Debug */}
					<button
						onClick={() => {
							if (typeof window !== "undefined") {
								// Force refresh theme classes
								const root = document.documentElement;
								const currentTheme = root.classList.contains("dark")
									? "dark"
									: "light";
								root.classList.remove("light", "dark");
								setTimeout(() => {
									root.classList.add(currentTheme);
								}, 10);
							}
						}}
						className="p-2 rounded-lg hover:bg-muted transition-colors text-xs border border-red-300 dark:border-red-600"
						title="Force Theme Refresh"
					>
						🔄
					</button>

					{/* Admin Profile */}
					<div className="flex items-center gap-3 ml-2">
						<div className="hidden sm:block text-right">
							<p className="text-sm font-medium text-foreground">Admin</p>
							<p className="text-xs text-muted-foreground">
								Super Administrator
							</p>
						</div>
						<div className="relative">
							<div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
								<span className="text-xs font-bold text-white">AD</span>
							</div>
							<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
						</div>
					</div>

					{/* Logout */}
					<button className="p-2 rounded-lg hover:bg-muted transition-colors text-red-600 dark:text-red-400">
						<LogOut className="h-5 w-5" />
					</button>
				</div>
			</div>
		</header>
	);
}

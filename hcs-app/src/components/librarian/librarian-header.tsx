"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Search,
	Bell,
	Settings,
	LogOut,
	User,
	Sun,
	Moon,
	Menu,
	X,
	BookOpen,
	Clock,
	DollarSign,
} from "lucide-react";
import { useTheme } from "@/lib/theme-provider-new";
import Image from "next/image";

interface LibrarianData {
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
	libraryStats: {
		totalBooks: number;
		issuedBooks: number;
		overdueBooks: number;
		reservedBooks: number;
		activeMembers: number;
		finesCollected: number;
	};
	recentActivities: Array<{
		id: number;
		type: string;
		description: string;
		timestamp: string;
		studentId: string;
	}>;
}

interface LibrarianHeaderProps {
	librarianData: LibrarianData;
}

export function LibrarianHeader({ librarianData }: LibrarianHeaderProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [showNotifications, setShowNotifications] = useState(false);
	const [showProfile, setShowProfile] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const { theme, setTheme } = useTheme();

	const notifications = [
		{
			id: 1,
			title: "Overdue Books Alert",
			message: "15 books are overdue by more than 7 days",
			time: "5 mins ago",
			type: "warning",
			icon: Clock,
		},
		{
			id: 2,
			title: "New Book Reservation",
			message: "Mathematics Grade 10 has been reserved",
			time: "10 mins ago",
			type: "info",
			icon: BookOpen,
		},
		{
			id: 3,
			title: "Fine Collection",
			message: "₹500 fine collected today",
			time: "1 hour ago",
			type: "success",
			icon: DollarSign,
		},
	];

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle search functionality
		console.log("Searching for:", searchQuery);
	};

	const handleLogout = () => {
		// Handle logout functionality
		console.log("Logging out...");
	};

	return (
		<header className="bg-card border-b border-border shadow-sm">
			<div className="px-4 lg:px-6 py-4">
				<div className="flex items-center justify-between">
					{/* Left Section - Mobile Menu & Search */}
					<div className="flex items-center gap-4 flex-1">
						{/* Mobile Menu Button */}
						<button
							onClick={() => setShowMobileMenu(!showMobileMenu)}
							className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors touch-target"
						>
							{showMobileMenu ? (
								<X className="h-5 w-5 text-foreground" />
							) : (
								<Menu className="h-5 w-5 text-foreground" />
							)}
						</button>

						{/* Search Bar */}
						<form
							onSubmit={handleSearch}
							className="hidden sm:block max-w-md w-full"
						>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<input
									type="text"
									placeholder="Search books, students, or records..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
								/>
							</div>
						</form>
					</div>

					{/* Right Section - Actions & Profile */}
					<div className="flex items-center gap-2">
						{/* Mobile Search Button */}
						<button className="sm:hidden p-2 rounded-lg hover:bg-muted transition-colors touch-target">
							<Search className="h-5 w-5 text-foreground" />
						</button>

						{/* Theme Toggle */}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
							className="p-2 rounded-lg hover:bg-muted transition-colors touch-target"
						>
							{theme === "dark" ? (
								<Sun className="h-5 w-5 text-foreground" />
							) : (
								<Moon className="h-5 w-5 text-foreground" />
							)}
						</motion.button>

						{/* Notifications */}
						<div className="relative">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setShowNotifications(!showNotifications)}
								className="p-2 rounded-lg hover:bg-muted transition-colors relative touch-target"
							>
								<Bell className="h-5 w-5 text-foreground" />
								<span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
									<span className="text-xs text-white font-bold">3</span>
								</span>
							</motion.button>

							{/* Notifications Dropdown */}
							{showNotifications && (
								<motion.div
									initial={{ opacity: 0, y: 10, scale: 0.95 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ opacity: 0, y: 10, scale: 0.95 }}
									className="absolute right-0 top-full mt-2 w-80 bg-card rounded-xl border border-border shadow-lg z-50"
								>
									<div className="p-4 border-b border-border">
										<h3 className="font-semibold text-foreground">
											Notifications
										</h3>
									</div>
									<div className="max-h-80 overflow-y-auto">
										{notifications.map((notification) => {
											const Icon = notification.icon;
											return (
												<div
													key={notification.id}
													className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
												>
													<div className="flex items-start gap-3">
														<div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
															<Icon className="h-4 w-4 text-primary" />
														</div>
														<div className="flex-1 min-w-0">
															<p className="font-medium text-foreground text-sm">
																{notification.title}
															</p>
															<p className="text-sm text-muted-foreground">
																{notification.message}
															</p>
															<p className="text-xs text-muted-foreground mt-1">
																{notification.time}
															</p>
														</div>
													</div>
												</div>
											);
										})}
									</div>
									<div className="p-3 border-t border-border">
										<button className="w-full text-sm text-primary hover:text-primary/80 transition-colors">
											View all notifications
										</button>
									</div>
								</motion.div>
							)}
						</div>

						{/* Profile Dropdown */}
						<div className="relative">
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => setShowProfile(!showProfile)}
								className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors touch-target"
							>
								<div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
									<Image
										src={librarianData.profilePicture}
										alt={librarianData.name}
										width={32}
										height={32}
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="hidden lg:block text-left">
									<p className="text-sm font-medium text-foreground">
										{librarianData.name}
									</p>
									<p className="text-xs text-muted-foreground">
										{librarianData.designation}
									</p>
								</div>
							</motion.button>

							{/* Profile Dropdown */}
							{showProfile && (
								<motion.div
									initial={{ opacity: 0, y: 10, scale: 0.95 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ opacity: 0, y: 10, scale: 0.95 }}
									className="absolute right-0 top-full mt-2 w-64 bg-card rounded-xl border border-border shadow-lg z-50"
								>
									<div className="p-4 border-b border-border">
										<div className="flex items-center gap-3">
											<div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
												<Image
													src={librarianData.profilePicture}
													alt={librarianData.name}
													width={48}
													height={48}
													className="w-full h-full object-cover"
												/>
											</div>
											<div>
												<p className="font-semibold text-foreground">
													{librarianData.name}
												</p>
												<p className="text-sm text-muted-foreground">
													{librarianData.email}
												</p>
												<p className="text-xs text-muted-foreground">
													ID: {librarianData.employeeId}
												</p>
											</div>
										</div>
									</div>
									<div className="p-2">
										<button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">
											<User className="h-4 w-4" />
											View Profile
										</button>
										<button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">
											<Settings className="h-4 w-4" />
											Settings
										</button>
										<button
											onClick={handleLogout}
											className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
										>
											<LogOut className="h-4 w-4" />
											Sign Out
										</button>
									</div>
								</motion.div>
							)}
						</div>
					</div>
				</div>

				{/* Mobile Search Bar */}
				<form onSubmit={handleSearch} className="sm:hidden mt-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<input
							type="text"
							placeholder="Search books, students, or records..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
						/>
					</div>
				</form>
			</div>

			{/* Click outside to close dropdowns */}
			{(showNotifications || showProfile) && (
				<div
					className="fixed inset-0 z-40"
					onClick={() => {
						setShowNotifications(false);
						setShowProfile(false);
					}}
				/>
			)}
		</header>
	);
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Bell,
	Search,
	Menu,
	X,
	User,
	Settings,
	LogOut,
	Award,
	Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card } from "@/components/ui/card";

interface StudentData {
	id: string;
	name: string;
	class: string;
	rollNumber: string;
	profileImage: string;
	totalPoints: number;
	level: string;
	attendance: number;
}

interface StudentHeaderProps {
	studentData: StudentData;
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
}

export function StudentHeader({
	studentData,
	sidebarOpen,
	setSidebarOpen,
}: StudentHeaderProps) {
	const [notificationsOpen, setNotificationsOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);

	const notifications = [
		{
			id: 1,
			title: "New Assignment Posted",
			message: "Math assignment for Chapter 5 is now available",
			time: "2 hours ago",
			type: "assignment",
			read: false,
		},
		{
			id: 2,
			title: "Exam Results Published",
			message: "Your Science exam results are now available",
			time: "1 day ago",
			type: "result",
			read: false,
		},
		{
			id: 3,
			title: "Achievement Unlocked!",
			message: "You earned the 'Perfect Attendance' badge",
			time: "2 days ago",
			type: "achievement",
			read: true,
		},
	];

	const unreadCount = notifications.filter((n) => !n.read).length;

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-lg">
			<div className="flex items-center justify-between px-4 py-3 lg:px-6">
				{/* Left Section */}
				<div className="flex items-center space-x-4">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="lg:hidden p-2"
					>
						{sidebarOpen ? (
							<X className="w-5 h-5" />
						) : (
							<Menu className="w-5 h-5" />
						)}
					</Button>

					<div className="hidden lg:block">
						<h1 className="text-xl font-bold text-foreground">
							Student Portal
						</h1>
						<p className="text-sm text-muted-foreground">
							Welcome back, {studentData.name.split(" ")[0]}!
						</p>
					</div>
				</div>

				{/* Center Section - Search */}
				<div className="hidden md:flex flex-1 max-w-lg mx-8">
					<div className="relative w-full">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Search assignments, classes, library..."
							className="pl-10 bg-muted/50 border-border focus:bg-background"
						/>
					</div>
				</div>

				{/* Right Section */}
				<div className="flex items-center space-x-2 md:space-x-4">
					{/* Points Display */}
					<div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 px-3 py-1 rounded-full">
						<Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
						<span className="text-sm font-medium text-foreground">
							{studentData.totalPoints}
						</span>
					</div>

					{/* Theme Toggle */}
					<ThemeToggle />

					{/* Notifications */}
					<div className="relative">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setNotificationsOpen(!notificationsOpen)}
							className="relative p-2"
						>
							<Bell className="w-5 h-5" />
							{unreadCount > 0 && (
								<span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
									{unreadCount}
								</span>
							)}
						</Button>

						{notificationsOpen && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								className="absolute right-0 top-12 w-80 z-50"
							>
								<Card className="p-4 bg-card border-border shadow-xl">
									<div className="flex items-center justify-between mb-4">
										<h3 className="font-semibold text-foreground">
											Notifications
										</h3>
										<Button variant="ghost" size="sm" className="text-xs">
											Mark all read
										</Button>
									</div>
									<div className="space-y-3 max-h-64 overflow-y-auto">
										{notifications.map((notification) => (
											<div
												key={notification.id}
												className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
													!notification.read
														? "bg-primary/5 border-primary/20"
														: "bg-muted/20 border-border"
												}`}
											>
												<div className="flex items-start space-x-3">
													<div
														className={`w-2 h-2 rounded-full mt-2 ${
															!notification.read
																? "bg-primary"
																: "bg-muted-foreground"
														}`}
													/>
													<div className="flex-1">
														<h4 className="text-sm font-medium text-foreground">
															{notification.title}
														</h4>
														<p className="text-xs text-muted-foreground mt-1">
															{notification.message}
														</p>
														<p className="text-xs text-muted-foreground mt-1">
															{notification.time}
														</p>
													</div>
												</div>
											</div>
										))}
									</div>
								</Card>
							</motion.div>
						)}
					</div>

					{/* Profile */}
					<div className="relative">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setProfileOpen(!profileOpen)}
							className="flex items-center space-x-2 p-2"
						>
							<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
								<User className="w-5 h-5 text-white" />
							</div>
							<div className="hidden md:block text-left">
								<p className="text-sm font-medium text-foreground">
									{studentData.name.split(" ")[0]}
								</p>
								<p className="text-xs text-muted-foreground">
									{studentData.class}
								</p>
							</div>
						</Button>

						{profileOpen && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								className="absolute right-0 top-12 w-64 z-50"
							>
								<Card className="p-4 bg-card border-border shadow-xl">
									<div className="flex items-center space-x-3 mb-4">
										<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
											<User className="w-6 h-6 text-white" />
										</div>
										<div>
											<h3 className="font-semibold text-foreground">
												{studentData.name}
											</h3>
											<p className="text-sm text-muted-foreground">
												{studentData.class} • {studentData.rollNumber}
											</p>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
										<div className="text-center">
											<div className="flex items-center justify-center mb-1">
												<Award className="w-4 h-4 text-yellow-600 mr-1" />
												<span className="text-sm font-semibold text-foreground">
													{studentData.totalPoints}
												</span>
											</div>
											<p className="text-xs text-muted-foreground">Points</p>
										</div>
										<div className="text-center">
											<p className="text-sm font-semibold text-foreground">
												{studentData.attendance}%
											</p>
											<p className="text-xs text-muted-foreground">
												Attendance
											</p>
										</div>
									</div>

									<div className="space-y-2">
										<Button
											variant="ghost"
											className="w-full justify-start text-sm"
										>
											<Settings className="w-4 h-4 mr-2" />
											Settings
										</Button>
										<Button
											variant="ghost"
											className="w-full justify-start text-sm text-destructive hover:text-destructive"
										>
											<LogOut className="w-4 h-4 mr-2" />
											Logout
										</Button>
									</div>
								</Card>
							</motion.div>
						)}
					</div>
				</div>
			</div>

			{/* Mobile Search Bar */}
			<div className="md:hidden px-4 pb-3">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="Search..."
						className="pl-10 bg-muted/50 border-border"
					/>
				</div>
			</div>
		</header>
	);
}

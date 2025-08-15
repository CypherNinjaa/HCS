"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Camera,
	Bell,
	Search,
	Settings,
	User,
	LogOut,
	Moon,
	Sun,
	Monitor,
	ChevronDown,
	Upload,
	Eye,
	MessageSquare,
	Menu,
} from "lucide-react";
import { useTheme } from "@/lib/theme-provider-new";
import Image from "next/image";

interface MediaCoordinatorData {
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
	mediaStats: {
		totalImages: number;
		totalVideos: number;
		activeNews: number;
		totalViews: number;
		pendingApprovals: number;
		scheduledPosts: number;
	};
	recentActivities: Array<{
		id: number;
		type: string;
		description: string;
		timestamp: string;
		contentId: string;
	}>;
}

interface MediaCoordinatorHeaderProps {
	mediaCoordinatorData: MediaCoordinatorData;
	onToggleSidebar: () => void;
}

export function MediaCoordinatorHeader({
	mediaCoordinatorData,
	onToggleSidebar,
}: MediaCoordinatorHeaderProps) {
	const [showNotifications, setShowNotifications] = useState(false);
	const [showProfile, setShowProfile] = useState(false);
	const { theme, setTheme } = useTheme();

	const notifications = [
		{
			id: 1,
			type: "upload",
			title: "Gallery Upload Complete",
			message: "Sports Day 2025 gallery has been processed",
			timestamp: "2 minutes ago",
			isRead: false,
		},
		{
			id: 2,
			type: "approval",
			title: "News Article Pending",
			message: "Annual Day announcement needs approval",
			timestamp: "15 minutes ago",
			isRead: false,
		},
		{
			id: 3,
			type: "engagement",
			title: "High Engagement Alert",
			message: "Cultural fest video reached 1000+ views",
			timestamp: "1 hour ago",
			isRead: true,
		},
		{
			id: 4,
			type: "schedule",
			title: "Scheduled Post Ready",
			message: "Exam timetable will go live in 30 minutes",
			timestamp: "2 hours ago",
			isRead: true,
		},
	];

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case "upload":
				return Upload;
			case "approval":
				return MessageSquare;
			case "engagement":
				return Eye;
			case "schedule":
				return Bell;
			default:
				return Bell;
		}
	};

	const themeIcons = {
		light: Sun,
		dark: Moon,
		system: Monitor,
	};

	const ThemeIcon = themeIcons[theme as keyof typeof themeIcons] || Monitor;

	return (
		<motion.header
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-card border-b border-border shadow-soft h-16 flex items-center justify-between px-6 relative z-50"
		>
			{/* Left Section */}
			<div className="flex items-center gap-6">
				{/* Mobile menu button */}
				<button
					onClick={onToggleSidebar}
					className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
				>
					<Menu className="h-5 w-5 text-foreground" />
				</button>

				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
						<Camera className="h-6 w-6 text-white" />
					</div>
					<div>
						<h1 className="text-lg font-bold text-foreground">
							Media Coordinator Portal
						</h1>
						<p className="text-xs text-muted-foreground">
							Content Management System
						</p>
					</div>
				</div>

				{/* Quick Stats */}
				<div className="hidden lg:flex items-center gap-6 ml-8">
					<div className="text-center">
						<p className="text-xs text-muted-foreground">Images</p>
						<p className="font-bold text-foreground">
							{mediaCoordinatorData.mediaStats.totalImages}
						</p>
					</div>
					<div className="text-center">
						<p className="text-xs text-muted-foreground">Videos</p>
						<p className="font-bold text-foreground">
							{mediaCoordinatorData.mediaStats.totalVideos}
						</p>
					</div>
					<div className="text-center">
						<p className="text-xs text-muted-foreground">Active News</p>
						<p className="font-bold text-purple-600 dark:text-purple-400">
							{mediaCoordinatorData.mediaStats.activeNews}
						</p>
					</div>
					<div className="text-center">
						<p className="text-xs text-muted-foreground">Total Views</p>
						<p className="font-bold text-green-600 dark:text-green-400">
							{mediaCoordinatorData.mediaStats.totalViews.toLocaleString()}
						</p>
					</div>
				</div>
			</div>

			{/* Right Section */}
			<div className="flex items-center gap-4">
				{/* Search */}
				<div className="hidden md:flex relative">
					<Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
					<input
						type="text"
						placeholder="Search content..."
						className="pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-64"
					/>
				</div>

				{/* Theme Toggle */}
				<div className="relative">
					<button
						onClick={() => {
							const themes = ["light", "dark", "system"] as const;
							const currentIndex = themes.indexOf(
								theme as "light" | "dark" | "system"
							);
							const nextIndex = (currentIndex + 1) % themes.length;
							setTheme(themes[nextIndex]);
						}}
						className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
						title={`Current theme: ${theme}`}
					>
						<ThemeIcon className="h-5 w-5" />
					</button>
				</div>

				{/* Notifications */}
				<div className="relative">
					<button
						onClick={() => setShowNotifications(!showNotifications)}
						className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors relative"
					>
						<Bell className="h-5 w-5" />
						{unreadCount > 0 && (
							<span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
								{unreadCount > 9 ? "9+" : unreadCount}
							</span>
						)}
					</button>

					{/* Notifications Dropdown */}
					{showNotifications && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							className="absolute right-0 top-12 w-80 bg-card border border-border rounded-lg shadow-lg z-50"
						>
							<div className="p-4 border-b border-border">
								<h3 className="font-semibold text-foreground">Notifications</h3>
								<p className="text-xs text-muted-foreground">
									{unreadCount} unread notifications
								</p>
							</div>
							<div className="max-h-96 overflow-y-auto">
								{notifications.map((notification) => {
									const NotificationIcon = getNotificationIcon(
										notification.type
									);
									return (
										<div
											key={notification.id}
											className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors ${
												!notification.isRead ? "bg-primary/5" : ""
											}`}
										>
											<div className="flex items-start gap-3">
												<div
													className={`w-8 h-8 rounded-full flex items-center justify-center ${
														notification.type === "upload"
															? "bg-blue-100 dark:bg-blue-900/30"
															: notification.type === "approval"
															? "bg-orange-100 dark:bg-orange-900/30"
															: notification.type === "engagement"
															? "bg-green-100 dark:bg-green-900/30"
															: "bg-purple-100 dark:bg-purple-900/30"
													}`}
												>
													<NotificationIcon
														className={`h-4 w-4 ${
															notification.type === "upload"
																? "text-blue-600 dark:text-blue-400"
																: notification.type === "approval"
																? "text-orange-600 dark:text-orange-400"
																: notification.type === "engagement"
																? "text-green-600 dark:text-green-400"
																: "text-purple-600 dark:text-purple-400"
														}`}
													/>
												</div>
												<div className="flex-1">
													<h4 className="font-medium text-foreground text-sm">
														{notification.title}
													</h4>
													<p className="text-xs text-muted-foreground mb-1">
														{notification.message}
													</p>
													<p className="text-xs text-muted-foreground">
														{notification.timestamp}
													</p>
												</div>
												{!notification.isRead && (
													<div className="w-2 h-2 bg-primary rounded-full"></div>
												)}
											</div>
										</div>
									);
								})}
							</div>
							<div className="p-3 border-t border-border">
								<button className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors">
									Mark all as read
								</button>
							</div>
						</motion.div>
					)}
				</div>

				{/* Profile */}
				<div className="relative">
					<button
						onClick={() => setShowProfile(!showProfile)}
						className="flex items-center gap-2 p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
					>
						<div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
							<Image
								src={mediaCoordinatorData.profilePicture}
								alt={mediaCoordinatorData.name}
								width={32}
								height={32}
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="hidden md:block text-left">
							<p className="text-sm font-medium text-foreground">
								{mediaCoordinatorData.name}
							</p>
							<p className="text-xs text-muted-foreground">
								{mediaCoordinatorData.designation}
							</p>
						</div>
						<ChevronDown className="h-4 w-4" />
					</button>

					{/* Profile Dropdown */}
					{showProfile && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							className="absolute right-0 top-12 w-64 bg-card border border-border rounded-lg shadow-lg z-50"
						>
							<div className="p-4 border-b border-border">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
										<Image
											src={mediaCoordinatorData.profilePicture}
											alt={mediaCoordinatorData.name}
											width={48}
											height={48}
											className="w-full h-full object-cover"
										/>
									</div>
									<div>
										<p className="font-semibold text-foreground">
											{mediaCoordinatorData.name}
										</p>
										<p className="text-xs text-muted-foreground">
											{mediaCoordinatorData.email}
										</p>
										<p className="text-xs text-primary">
											ID: {mediaCoordinatorData.employeeId}
										</p>
									</div>
								</div>
							</div>
							<div className="p-2">
								<button className="w-full flex items-center gap-3 p-2 text-left hover:bg-muted rounded-lg transition-colors">
									<User className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm text-foreground">
										Profile Settings
									</span>
								</button>
								<button className="w-full flex items-center gap-3 p-2 text-left hover:bg-muted rounded-lg transition-colors">
									<Settings className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm text-foreground">Preferences</span>
								</button>
								<hr className="my-2 border-border" />
								<button className="w-full flex items-center gap-3 p-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400">
									<LogOut className="h-4 w-4" />
									<span className="text-sm">Sign Out</span>
								</button>
							</div>
						</motion.div>
					)}
				</div>
			</div>

			{/* Click outside handlers */}
			{(showNotifications || showProfile) && (
				<div
					className="fixed inset-0 z-40"
					onClick={() => {
						setShowNotifications(false);
						setShowProfile(false);
					}}
				/>
			)}
		</motion.header>
	);
}

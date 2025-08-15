"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Home,
	Camera,
	Video,
	Newspaper,
	Calendar,
	Archive,
	MessageSquare,
	BarChart3,
	Settings,
	Tags,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

interface MediaCoordinatorSidebarProps {
	mediaCoordinatorData: MediaCoordinatorData;
}

export function MediaCoordinatorSidebar({
	mediaCoordinatorData,
}: MediaCoordinatorSidebarProps) {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const pathname = usePathname();

	const menuItems = [
		{
			title: "Dashboard",
			icon: Home,
			href: "/dashboard/media-coordinator",
			badge: null,
		},
		{
			title: "Gallery Management",
			icon: Camera,
			href: "/dashboard/media-coordinator/gallery",
			submenu: [
				{
					title: "Upload Images",
					href: "/dashboard/media-coordinator/gallery/upload",
				},
				{
					title: "Manage Albums",
					href: "/dashboard/media-coordinator/gallery/albums",
				},
				{
					title: "Image Library",
					href: "/dashboard/media-coordinator/gallery/library",
				},
				{
					title: "Bulk Operations",
					href: "/dashboard/media-coordinator/gallery/bulk",
				},
			],
		},
		{
			title: "Video Management",
			icon: Video,
			href: "/dashboard/media-coordinator/videos",
			submenu: [
				{
					title: "Upload Videos",
					href: "/dashboard/media-coordinator/videos/upload",
				},
				{
					title: "Video Library",
					href: "/dashboard/media-coordinator/videos/library",
				},
				{
					title: "Video Categories",
					href: "/dashboard/media-coordinator/videos/categories",
				},
				{
					title: "Processing Queue",
					href: "/dashboard/media-coordinator/videos/queue",
				},
			],
		},
		{
			title: "News & Announcements",
			icon: Newspaper,
			href: "/dashboard/media-coordinator/news",
			submenu: [
				{
					title: "Create News",
					href: "/dashboard/media-coordinator/news/create",
				},
				{
					title: "All Articles",
					href: "/dashboard/media-coordinator/news/articles",
				},
				{
					title: "Circulars",
					href: "/dashboard/media-coordinator/news/circulars",
				},
				{
					title: "Announcements",
					href: "/dashboard/media-coordinator/news/announcements",
				},
			],
			badge:
				mediaCoordinatorData.mediaStats.pendingApprovals > 0
					? mediaCoordinatorData.mediaStats.pendingApprovals.toString()
					: null,
		},
		{
			title: "Content Tagging",
			icon: Tags,
			href: "/dashboard/media-coordinator/tagging",
			submenu: [
				{
					title: "Tag Management",
					href: "/dashboard/media-coordinator/tagging/manage",
				},
				{
					title: "Category Setup",
					href: "/dashboard/media-coordinator/tagging/categories",
				},
				{
					title: "Bulk Tagging",
					href: "/dashboard/media-coordinator/tagging/bulk",
				},
				{
					title: "Search Filters",
					href: "/dashboard/media-coordinator/tagging/filters",
				},
			],
		},
		{
			title: "Scheduling",
			icon: Calendar,
			href: "/dashboard/media-coordinator/scheduling",
			submenu: [
				{
					title: "Schedule Posts",
					href: "/dashboard/media-coordinator/scheduling/posts",
				},
				{
					title: "Content Calendar",
					href: "/dashboard/media-coordinator/scheduling/calendar",
				},
				{
					title: "Automated Publishing",
					href: "/dashboard/media-coordinator/scheduling/automation",
				},
				{
					title: "Queue Management",
					href: "/dashboard/media-coordinator/scheduling/queue",
				},
			],
			badge:
				mediaCoordinatorData.mediaStats.scheduledPosts > 0
					? mediaCoordinatorData.mediaStats.scheduledPosts.toString()
					: null,
		},
		{
			title: "Archive Management",
			icon: Archive,
			href: "/dashboard/media-coordinator/archive",
			submenu: [
				{
					title: "Archived Content",
					href: "/dashboard/media-coordinator/archive/content",
				},
				{
					title: "Auto Archive Rules",
					href: "/dashboard/media-coordinator/archive/rules",
				},
				{
					title: "Backup & Restore",
					href: "/dashboard/media-coordinator/archive/backup",
				},
				{
					title: "Storage Analytics",
					href: "/dashboard/media-coordinator/archive/storage",
				},
			],
		},
		{
			title: "Comment Moderation",
			icon: MessageSquare,
			href: "/dashboard/media-coordinator/moderation",
			submenu: [
				{
					title: "Pending Comments",
					href: "/dashboard/media-coordinator/moderation/pending",
				},
				{
					title: "Reported Content",
					href: "/dashboard/media-coordinator/moderation/reported",
				},
				{
					title: "Moderation Rules",
					href: "/dashboard/media-coordinator/moderation/rules",
				},
				{
					title: "User Management",
					href: "/dashboard/media-coordinator/moderation/users",
				},
			],
		},
		{
			title: "Analytics & Metrics",
			icon: BarChart3,
			href: "/dashboard/media-coordinator/analytics",
			submenu: [
				{
					title: "Engagement Reports",
					href: "/dashboard/media-coordinator/analytics/engagement",
				},
				{
					title: "Content Performance",
					href: "/dashboard/media-coordinator/analytics/performance",
				},
				{
					title: "View Statistics",
					href: "/dashboard/media-coordinator/analytics/views",
				},
				{
					title: "Export Reports",
					href: "/dashboard/media-coordinator/analytics/export",
				},
			],
		},
		{
			title: "Settings",
			icon: Settings,
			href: "/dashboard/media-coordinator/settings",
			submenu: [
				{
					title: "Media Settings",
					href: "/dashboard/media-coordinator/settings/media",
				},
				{
					title: "Upload Limits",
					href: "/dashboard/media-coordinator/settings/limits",
				},
				{
					title: "Quality Settings",
					href: "/dashboard/media-coordinator/settings/quality",
				},
				{
					title: "Approval Workflow",
					href: "/dashboard/media-coordinator/settings/workflow",
				},
			],
		},
	];

	const isActive = (href: string) => {
		return pathname === href || pathname.startsWith(href + "/");
	};

	const toggleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};

	return (
		<motion.aside
			animate={{ width: isCollapsed ? 80 : 280 }}
			transition={{ duration: 0.3, ease: "easeInOut" }}
			className="bg-card border-r border-border shadow-lg flex flex-col h-full relative"
		>
			{/* Header */}
			<div className="p-4 border-b border-border">
				<div className="flex items-center justify-between">
					{!isCollapsed && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="flex items-center gap-3"
						>
							<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
								<Camera className="h-6 w-6 text-white" />
							</div>
							<div>
								<h2 className="font-bold text-foreground text-sm">
									Media Portal
								</h2>
								<p className="text-xs text-muted-foreground">
									Content Management
								</p>
							</div>
						</motion.div>
					)}
					{isCollapsed && (
						<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto">
							<Camera className="h-6 w-6 text-white" />
						</div>
					)}
				</div>
			</div>

			{/* Toggle Button */}
			<button
				onClick={toggleCollapse}
				className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
			>
				{isCollapsed ? (
					<ChevronRight className="h-3 w-3 text-foreground" />
				) : (
					<ChevronLeft className="h-3 w-3 text-foreground" />
				)}
			</button>

			{/* Navigation Menu */}
			<nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
				{menuItems.map((item, index) => {
					const Icon = item.icon;
					const isItemActive = isActive(item.href);

					return (
						<div key={item.title}>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.05 }}
							>
								<Link
									href={item.href}
									className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative ${
										isItemActive
											? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
											: "hover:bg-muted text-foreground"
									} ${isCollapsed ? "justify-center" : ""}`}
									title={isCollapsed ? item.title : ""}
								>
									<Icon
										className={`h-5 w-5 ${
											isItemActive
												? "text-white"
												: "text-muted-foreground group-hover:text-foreground"
										}`}
									/>
									{!isCollapsed && (
										<>
											<span className="font-medium text-sm">{item.title}</span>
											{item.badge && (
												<span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
													{item.badge}
												</span>
											)}
										</>
									)}
									{isCollapsed && item.badge && (
										<span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
											{parseInt(item.badge) > 9 ? "9+" : item.badge}
										</span>
									)}
								</Link>
							</motion.div>

							{/* Submenu */}
							{item.submenu && !isCollapsed && isItemActive && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									className="ml-8 mt-2 space-y-1"
								>
									{item.submenu.map((subItem) => (
										<Link
											key={subItem.title}
											href={subItem.href}
											className={`block p-2 pl-4 rounded-lg text-sm transition-colors border-l-2 ${
												pathname === subItem.href
													? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-500"
													: "text-muted-foreground hover:text-foreground hover:bg-muted border-transparent"
											}`}
										>
											{subItem.title}
										</Link>
									))}
								</motion.div>
							)}
						</div>
					);
				})}
			</nav>

			{/* Quick Stats - Only when expanded */}
			{!isCollapsed && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="p-4 border-t border-border bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
				>
					<h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
						Quick Stats
					</h3>
					<div className="space-y-2">
						<div className="flex items-center justify-between text-xs">
							<span className="text-muted-foreground">Total Images</span>
							<span className="font-semibold text-purple-600 dark:text-purple-400">
								{mediaCoordinatorData.mediaStats.totalImages}
							</span>
						</div>
						<div className="flex items-center justify-between text-xs">
							<span className="text-muted-foreground">Videos</span>
							<span className="font-semibold text-pink-600 dark:text-pink-400">
								{mediaCoordinatorData.mediaStats.totalVideos}
							</span>
						</div>
						<div className="flex items-center justify-between text-xs">
							<span className="text-muted-foreground">Active News</span>
							<span className="font-semibold text-blue-600 dark:text-blue-400">
								{mediaCoordinatorData.mediaStats.activeNews}
							</span>
						</div>
						<div className="flex items-center justify-between text-xs">
							<span className="text-muted-foreground">Total Views</span>
							<span className="font-semibold text-green-600 dark:text-green-400">
								{mediaCoordinatorData.mediaStats.totalViews.toLocaleString()}
							</span>
						</div>
						<div className="flex items-center justify-between text-xs">
							<span className="text-muted-foreground">Pending</span>
							<span className="font-semibold text-orange-600 dark:text-orange-400">
								{mediaCoordinatorData.mediaStats.pendingApprovals}
							</span>
						</div>
					</div>
				</motion.div>
			)}
		</motion.aside>
	);
}
